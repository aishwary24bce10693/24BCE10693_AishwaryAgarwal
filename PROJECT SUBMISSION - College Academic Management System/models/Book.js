const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    },

    // Many-to-many: one book can be borrowed by many students.
    borrowedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ]
  },
  {
    timestamps: true
  }
);

bookSchema.pre("validate", function validateAvailableCopies(next) {
  if (this.availableCopies > this.totalCopies) {
    this.invalidate("availableCopies", "Available copies cannot be greater than total copies.");
  }

  next();
});

module.exports = mongoose.model("Book", bookSchema);
