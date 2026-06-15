const Department = require("../models/Department");
const Staff = require("../models/Staff");

const createDepartment = async (req, res, next) => {
  try {
    const { hod, students, staff, ...departmentData } = req.body;
    const department = await Department.create(departmentData);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate("hod", "employeeId name email designation")
      .populate("students", "rollNumber name email year")
      .populate("staff", "employeeId name email designation");

    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("hod", "employeeId name email designation")
      .populate("students", "rollNumber name email year")
      .populate("staff", "employeeId name email designation");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { hod, students, staff, ...updates } = req.body;

    const department = await Department.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    if (department.students.length > 0 || department.staff.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Move or delete linked students/staff before deleting this department"
      });
    }

    if (department.hod) {
      await Staff.findByIdAndUpdate(department.hod, { $set: { hodOfDepartment: null } });
    }

    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const assignHod = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const department = await Department.findById(req.params.id);
    const staff = await Staff.findById(staffId);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    if (staff.department.toString() !== department._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "HOD must be a staff member of the same department"
      });
    }

    if (department.hod) {
      await Staff.findByIdAndUpdate(department.hod, { $set: { hodOfDepartment: null } });
    }

    if (staff.hodOfDepartment) {
      await Department.findByIdAndUpdate(staff.hodOfDepartment, { $set: { hod: null } });
    }

    department.hod = staff._id;
    staff.hodOfDepartment = department._id;

    await department.save();
    await staff.save();

    const updatedDepartment = await Department.findById(department._id).populate(
      "hod",
      "employeeId name email designation"
    );

    res.status(200).json({ success: true, data: updatedDepartment });
  } catch (error) {
    next(error);
  }
};

const removeHod = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    if (department.hod) {
      await Staff.findByIdAndUpdate(department.hod, { $set: { hodOfDepartment: null } });
    }

    department.hod = null;
    await department.save();

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

const dropDepartments = async (req, res, next) => {
  try {
    await Department.collection.drop();
    res.status(200).json({ success: true, message: "Departments collection dropped" });
  } catch (error) {
    if (error.code === 26) {
      return res.status(200).json({ success: true, message: "Departments collection does not exist" });
    }

    next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignHod,
  removeHod,
  dropDepartments
};
