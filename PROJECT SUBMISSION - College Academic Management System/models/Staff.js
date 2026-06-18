const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    employeeId: {
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
    designation: {
      type: String,
      required: true,
      trim: true
    },

    // One-to-many: many staff members can belong to one department.
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    // One-to-one: one staff member can be HOD of one department.
    hodOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Staff", staffSchema);
