const express = require("express");
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  dropBooks
} = require("../controllers/bookController");

const router = express.Router();

router.route("/").post(createBook).get(getBooks);
router.route("/drop").delete(dropBooks);
router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;
