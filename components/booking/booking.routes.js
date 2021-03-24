const bookingCtrl = require("./booking.controller");
const { protect } = require("../middlewares/auth");

module.exports = (router) => {
    const prefix = "/bookings";
    /**
     *Route for Handling of New Booking
     */
    router.post(`${prefix}/create`, protect, bookingCtrl.createBooking);

    /**
     *Route for Getting all bookings of the user
     */
    router.get(`${prefix}/me`, protect, bookingCtrl.getUserBookings);

    /**
     *Route for Handling Update of a Booking
     */
    router.patch(`${prefix}/update`, protect, bookingCtrl.updateBooking);

    return router;
};
