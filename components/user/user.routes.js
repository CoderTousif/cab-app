const userCtrl = require("./user.controller");
const { protect } = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Leanne Graham
 *     User:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user ID.
 *               example: 0
 *         - $ref: '#/components/schemas/NewUser'
 */

module.exports = (router) => {
    const prefix = "/users";
    /**
     * @swagger
     * /users/signup:
     *    post:
     *      description: This should sign up a user
     */
    router.post(`${prefix}/signup`, userCtrl.signup);

    /**
     * @swagger
     * /users/login:
     *    post:
     *      description: This should log in a user
     */
    router.post(`${prefix}/login`, userCtrl.login);

    /**
     * @swagger
     * /users/logout:
     *    get:
     *      description: This should logout a user
     */
    router.get(`${prefix}/logout`, userCtrl.logout);

    /**
     * @swagger
     * /users/me:
     *    get:
     *      description: This should return everything about the user
     */
    router.get(`${prefix}/me`, protect, userCtrl.getMe);

    return router;
};
