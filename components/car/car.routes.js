const router = require("express").Router();
const carCtrl = require("./car.controller");
const { protect } = require("../middlewares/auth");

/**
 *Route for Adding of New car
 */
router.post("/create", protect, carCtrl.createCar);

router.get("/near-by", protect, carCtrl.getNearbyCars);

/**
 *Route for Handling Update of a car
 */
// router.patch("/car_update", protect, carCtrl.updateCar);

/**
 *Route for Getting all cars of the user
 */
// router.get("/cars", protect, carCtrl.getUserCars);

module.exports = router;
