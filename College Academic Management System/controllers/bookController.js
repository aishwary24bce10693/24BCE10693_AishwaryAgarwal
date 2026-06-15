const Book = require("../models/Book");
const Student = require("../models/Student");

const createBook = async (req, res, next) => {
  try {
    const { borrowedBy, ...body } = req.body;
    const bookData = {
      ...body,
      availableCopies: body.availableCopies ?? body.totalCopies
    };

    const book = await Book.create(bookData);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate("borrowedBy", "rollNumber name email");
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate("borrowedBy", "rollNumber name email");

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { borrowedBy, ...updates } = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    await Student.updateMany({ borrowedBooks: book._id }, { $pull: { borrowedBooks: book._id } });
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const dropBooks = async (req, res, next) => {
  try {
    await Book.collection.drop();
    await Student.updateMany({}, { $set: { borrowedBooks: [] } });

    res.status(200).json({ success: true, message: "Books collection dropped" });
  } catch (error) {
    if (error.code === 26) {
      return res.status(200).json({ success: true, message: "Books collection does not exist" });
    }

    next(error);
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  dropBooks
};
