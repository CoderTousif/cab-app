const carCtrl = require("./car.controller");
const { protect } = require("../middlewares/auth");

module.exports = (router) => {
    const prefix = "/cars";
    /**
     * @swagger
     * /users:
     *    get:
     *      description: This should return all users
     */
    router.post(`${prefix}/create`, protect, carCtrl.createCar);

    /**
     * @swagger
     * /users:
     *    get:
     *      description: This should return all users
     */
    router.get(`${prefix}/near-by`, protect, carCtrl.getNearbyCars);

    /**
     *Route for Handling Update of a car
     */
    // router.patch("/car_update", protect, carCtrl.updateCar);

    /**
     * @swagger
     * /users:
     *    get:
     *      description: This should return all users
     */
    router.get(`${prefix}/me`, protect, carCtrl.getMyCar);

    /**
     * @swagger
     * /users:
     *    get:
     *      description: This should return all users
     */
    router.get(`${prefix}/all`, carCtrl.getAllCars);

    return router;
};
