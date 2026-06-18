const express = require("express");
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  dropStaff
} = require("../controllers/staffController");

const router = express.Router();

router.route("/").post(createStaff).get(getStaff);
router.route("/drop").delete(dropStaff);
router.route("/:id").get(getStaffById).put(updateStaff).delete(deleteStaff);

module.exports = router;
