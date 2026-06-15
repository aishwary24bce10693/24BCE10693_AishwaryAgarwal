const Student = require("../models/Student");
const Department = require("../models/Department");
const Book = require("../models/Book");

const createStudent = async (req, res, next) => {
  try {
    const { borrowedBooks, ...studentData } = req.body;
    const department = await Department.findById(studentData.department);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    const student = await Student.create(studentData);
    await Department.findByIdAndUpdate(studentData.department, { $addToSet: { students: student._id } });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate("department", "name code")
      .populate("borrowedBooks", "title author isbn");

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("department", "name code")
      .populate("borrowedBooks", "title author isbn");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (req.body.department && req.body.department !== student.department.toString()) {
      const newDepartment = await Department.findById(req.body.department);

      if (!newDepartment) {
        return res.status(404).json({ success: false, message: "New department not found" });
      }

      await Department.findByIdAndUpdate(student.department, { $pull: { students: student._id } });
      await Department.findByIdAndUpdate(req.body.department, { $addToSet: { students: student._id } });
    }

    const { borrowedBooks, ...updates } = req.body;
    Object.assign(student, updates);
    await student.save();

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await Department.findByIdAndUpdate(student.department, { $pull: { students: student._id } });

    await Book.updateMany(
      { _id: { $in: student.borrowedBooks } },
      {
        $pull: { borrowedBy: student._id },
        $inc: { availableCopies: 1 }
      }
    );

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.params;
    const student = await Student.findById(studentId);
    const book = await Book.findById(bookId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const alreadyBorrowed = student.borrowedBooks.some((borrowedBookId) => borrowedBookId.equals(book._id));

    if (alreadyBorrowed) {
      return res.status(400).json({ success: false, message: "Student already borrowed this book" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ success: false, message: "No copies available for this book" });
    }

    student.borrowedBooks.push(book._id);
    book.borrowedBy.push(student._id);
    book.availableCopies -= 1;

    await student.save();
    await book.save();

    res.status(200).json({ success: true, message: "Book borrowed successfully", data: { student, book } });
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { studentId, bookId } = req.params;
    const student = await Student.findById(studentId);
    const book = await Book.findById(bookId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const hasBorrowedBook = student.borrowedBooks.some((borrowedBookId) => borrowedBookId.equals(book._id));

    if (!hasBorrowedBook) {
      return res.status(400).json({ success: false, message: "This student has not borrowed this book" });
    }

    student.borrowedBooks.pull(book._id);
    book.borrowedBy.pull(student._id);
    book.availableCopies += 1;

    await student.save();
    await book.save();

    res.status(200).json({ success: true, message: "Book returned successfully", data: { student, book } });
  } catch (error) {
    next(error);
  }
};

const dropStudents = async (req, res, next) => {
  try {
    await Student.collection.drop();
    await Department.updateMany({}, { $set: { students: [] } });
    await Book.updateMany({}, { $set: { borrowedBy: [] } });

    res.status(200).json({ success: true, message: "Students collection dropped" });
  } catch (error) {
    if (error.code === 26) {
      return res.status(200).json({ success: true, message: "Students collection does not exist" });
    }

    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  borrowBook,
  returnBook,
  dropStudents
};
