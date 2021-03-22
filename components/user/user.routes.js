
const router =require("express").Router();
const userCtrl = require("./user.controller")
/**
 *Route for Handling User SignUp
 */
router.post("/signup", userCtrl.signup);

/**
 *Route for Handling User Login
 */
router.post("/login", userCtrl.login);

/**
 *Route for Handling User Login
 */
router.get("/logout", userCtrl.logout);

module.exports = router;
