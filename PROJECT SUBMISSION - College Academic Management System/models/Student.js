const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    phone: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },

    // One-to-many: many students can belong to one department.
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    // Many-to-many: one student can borrow many books.
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);
