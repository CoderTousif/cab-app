const app = require("../../app");
const request = require("supertest")(app); //'http://localhost:5000'
const {
    models: { User },
} = require("../index");

// describe('POST /notes', () => {
//     // before(done => {
//     //     db.connect();
//     // });
//     it('creates new notes', () => {});
// });

beforeAll(async () => {
    //create admin
    await User.create({
        name: "Tousif Alkon",
        email: "toustif@alkon.com",
        password: "1234567890",
        confirmPassword: "1234567890",
        role: "admin",
    });
    // console.log(admin);
});

afterAll(async () => {
    await User.destroy();
});

describe("USER Service", () => {
    describe("POST /users/signup", function () {
        it("sign up a user", async function () {
            const response = await request.post("/users/signup").send({
                name: "John Doe",
                email: "john@doe.com",
                phone: "0123456789",
                password: "password21",
                confirmPassword: "password21",
            });

            expect(response.status).to.eql(201);

            const { body } = response;
            // console.log(body);
            expect(body).to.include.keys("token", "data", "status");
            expect(body.token.length).to.above(10);
        });
    });

    describe("POST /users/signup", function () {
        it("When user try to sign up without confirmPassword, it should return error", async function () {
            const response = await request.post("/users/signup").send({
                name: "John Doe",
                email: "john@doe.com",
                phone: "0123456789",
                password: "password21",
                // confirmPassword: "password21",
            });
            // console.log(response.body);
            expect(response.status).to.eql(400);

            const { body } = response;
            expect(body.status).to.eql("error");
        });
    });

    describe("POST /users/login", function () {
        it("user log in with valid information", async function () {
            const response = await request.post("/users/login").send({
                email: "toustif@alkon.com",
                password: "1234567890",
            });

            expect(response.status).to.eql(200);

            const { body } = response;
            expect(body).to.include.keys("token", "data", "status");
            expect(body.token.length).to.above(10);
            expect(body.status).to.eql("success");
        });
    });

    describe("POST /users/login", function () {
        it("When user try to log in with a invalid password, should return 401", async function () {
            const response = await request.post("/users/login").send({
                email: "toustif@alkon.com",
                password: "1234567",
            });

            expect(response.status).to.eql(401);

            const { body } = response;
            // console.log(body);
            expect(body).to.include.keys("status", "message", "error");
            // expect(body.token.length).to.above(10);
            expect(body.message).to.eql("Incorrect email or password");
        });
    });

    // describe("GET /users/:id", function () {
    //     it("should require login to get access", async function () {
    //         const response = await request.get("/users/5c8a1f292f8fb814b56fa184");
    //         const { body } = response;

    //         expect(response.status).to.equal(401);
    //         expect(body.message).to.eql("You need to login to get access");
    //     });
    // });

    // describe("GET /users", function () {
    //     it("require admin role to access the route", async function () {
    //         const response = await request.get("/users");
    //         // console.log(response.body);

    //         expect(response.status).to.oneOf([403, 401]);
    //     });
    // });
});
