const express = require("express");

const protect = require('../middleware/authMiddleware');

const {getUsers,createUser,updateUser,deleteUser,adminLoginController}  = require("../controllers/adminController");
const adminProtect = require("../middleware/authAdminMiddleware");

const router = express.Router();

router.post("/login", adminLoginController);
router.get('/users',adminProtect,getUsers);
router.post('/users',adminProtect,createUser);
router.put('/users/:id',adminProtect,updateUser);
router.delete('/users/:id',adminProtect,deleteUser);

module.exports = router;