const router = require("express").Router();
const bookingCtrl = require("./booking.controller");
const { protect } = require("../middlewares/auth");

/**
 *Route for Handling of New Booking
 */
router.post("/create", protect, bookingCtrl.createBooking);

/**
 *Route for Getting all bookings of the user
 */
router.get("/me", protect, bookingCtrl.getUserBookings);

/**
 *Route for Handling Update of a Booking
 */
router.patch("/update", protect, bookingCtrl.updateBooking);

module.exports = router;
