const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },

    // One-to-one: one department has one Head of Department.
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
      unique: true,
      sparse: true
    },

    // One-to-many: one department can contain many students.
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ],

    // One-to-many: one department can contain many staff members.
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Department", departmentSchema);
