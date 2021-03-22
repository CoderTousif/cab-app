const router = require("express").Router();
const bookingCtrl = require("./booking.controller");
const checkAuth = require("../middlewares/auth");

/**
 *Route for Handling of New Booking
 */
// router.post("/book", checkAuth, bookingCtrl.createBooking);

/**
 *Route for Handling Update of a Booking
 */
// router.patch("/booking_update", checkAuth, bookingCtrl.updateBooking);

/**
 *Route for Getting all bookings of the user
 */
// router.get("/bookings", checkAuth, bookingCtrl.getUserBookings);

module.exports = router;
