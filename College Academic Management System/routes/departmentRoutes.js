const express = require("express");
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignHod,
  removeHod,
  dropDepartments
} = require("../controllers/departmentController");

const router = express.Router();

router.route("/").post(createDepartment).get(getDepartments);
router.route("/drop").delete(dropDepartments);
router.route("/:id/hod").patch(assignHod).delete(removeHod);
router.route("/:id").get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

module.exports = router;
