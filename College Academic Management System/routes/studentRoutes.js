const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  borrowBook,
  returnBook,
  dropStudents
} = require("../controllers/studentController");

const router = express.Router();

router.route("/").post(createStudent).get(getStudents);
router.route("/drop").delete(dropStudents);
router.route("/:studentId/borrow/:bookId").post(borrowBook);
router.route("/:studentId/return/:bookId").post(returnBook);
router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
