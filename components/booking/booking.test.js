const request = require("supertest");
const app = require("../../app");

const Booking = require("../../src/models/Booking.js");
const Car = require("../../src/models/Car.js");

let token;
let bid;

const book = {
    initial_loc: [53.088415, 15.90474],
    final_loc: [52.788415, 16.05474],
    booking_amt: 6,
};

beforeAll(async () => {
    const response = await request(app).post("/api/login").send({
        email: "rcrimmins0@cnn.com",
        password: "NpAwQjd0o",
    });
    token = response.body.token;
});

afterAll(async () => {
    const booking = await Booking.findOne({
        where: {
            id: bid,
        },
    });
    await Car.update(
        {
            car_status: "open",
        },
        {
            where: {
                id: booking.car_id,
            },
        }
    );
    booking.destroy();
});

describe("BOOKING Service", () => {
    describe("GET /api/bookings/", () => {
        test("Retreving bookings of a user", async () => {
            const response = await request(app)
                .get("/api/bookings/?page=5")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });
    });

    describe("POST /api/book", () => {
        test("Creating a booking", async () => {
            const response = await request(app)
                .post("/api/book/?maxDistance=10000000000")
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            bid = response.body.bookId;
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("Booking created");
        });
    });

    describe("PATCH /api/booking_update", () => {
        test("Updating booking status", async () => {
            const response = await request(app)
                .patch("/api/booking_update")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    status_up: "completed",
                });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Updated");
        }, 20000);
    });
});
