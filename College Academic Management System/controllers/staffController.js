const Staff = require("../models/Staff");
const Department = require("../models/Department");

const createStaff = async (req, res, next) => {
  try {
    const { hodOfDepartment, ...staffData } = req.body;
    const department = await Department.findById(staffData.department);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    const staff = await Staff.create(staffData);
    await Department.findByIdAndUpdate(staffData.department, { $addToSet: { staff: staff._id } });

    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find()
      .populate("department", "name code")
      .populate("hodOfDepartment", "name code");

    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    next(error);
  }
};

const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("department", "name code")
      .populate("hodOfDepartment", "name code");

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    if (staff.hodOfDepartment && req.body.department && req.body.department !== staff.department.toString()) {
      return res.status(400).json({
        success: false,
        message: "Remove this staff member as HOD before moving them to another department"
      });
    }

    if (req.body.department && req.body.department !== staff.department.toString()) {
      const newDepartment = await Department.findById(req.body.department);

      if (!newDepartment) {
        return res.status(404).json({ success: false, message: "New department not found" });
      }

      await Department.findByIdAndUpdate(staff.department, { $pull: { staff: staff._id } });
      await Department.findByIdAndUpdate(req.body.department, { $addToSet: { staff: staff._id } });
    }

    const { hodOfDepartment, ...updates } = req.body;
    Object.assign(staff, updates);
    await staff.save();

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    await Department.findByIdAndUpdate(staff.department, { $pull: { staff: staff._id } });

    if (staff.hodOfDepartment) {
      await Department.findByIdAndUpdate(staff.hodOfDepartment, { $set: { hod: null } });
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const dropStaff = async (req, res, next) => {
  try {
    await Staff.collection.drop();
    await Department.updateMany({}, { $set: { staff: [], hod: null } });

    res.status(200).json({ success: true, message: "Staff collection dropped" });
  } catch (error) {
    if (error.code === 26) {
      return res.status(200).json({ success: true, message: "Staff collection does not exist" });
    }

    next(error);
  }
};

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  dropStaff
};
