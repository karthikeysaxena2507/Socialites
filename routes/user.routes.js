let router = require("express").Router();
let userCtrl = require("../controllers/user.controller");
let auth = require("../middleware/auth");

// SESSION AUTHENTICATION MIDDLEWARE FOR A USER
router.get("/auth", auth, userCtrl.checkAuth);

// REGISTER THE USER
router.post("/register", userCtrl.registerUser);

// LOGIN THE USER
router.post("/login", userCtrl.loginUser);

// GOOGLE LOGIN
router.post("/googlelogin", userCtrl.loginWithGoogle);

// ACCESSING ALL USERS
router.get("/get", userCtrl.getAllUsers);

// ACCESSING A PARTICULAR USER BY USERNAME
router.get("/find/:user", userCtrl.getUserByUsername);

// UPDATING THE PROFILE PIC OF USER
router.post("/updateimage", auth, userCtrl.updateProfileImage);

// UPDATING THE USER BIO IN PROFILE PAGE
router.post("/updatebio", auth, userCtrl.updateUserBio);

// RESETING THE PASSWORD
router.post("/reset", userCtrl.resetPassword);

// SENDING RESET PASSWORD MAIL TO USER
router.post("/forgot", userCtrl.forgotPassword);

// SENDING EMAIL VERIFICATION MAIL TO USER
router.post("/send", userCtrl.sendEmail);

// VERIFY THE REGISTERED USER
router.post("/verify", userCtrl.verifyUser);

// LOGGING OUT THE USER
router.post("/logout/:username", auth, userCtrl.logoutUser);

module.exports = router;