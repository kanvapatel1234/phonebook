const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const { createContact, getContacts, updateContact, deleteContact } = require("../controller/contactController");
const { registerUser,loginUser } = require("../controller/authController");
const router = express.Router();


router.get("/", verifyToken, getContacts);
router.post("/", verifyToken, createContact);
router.put("/:id", verifyToken, updateContact);
router.delete("/:id", verifyToken, deleteContact);



module.exports = router;