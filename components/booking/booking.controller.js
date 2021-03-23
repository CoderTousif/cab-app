const paginate = require("express-paginate");
const catchError = require("../../utils/catch-async-err");
const {
    models: { Booking, Car },
    sequelize,
} = require("../index");

exports.createBooking = catchError(async (req, res, next) => {
    // check if booking exists
    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id,
            status: "inTransit",
        },
    });

    if (bookings.length >= 1) {
        res.status(409).json({
            message: "Booking already exists",
        });
    }
    // create booking
    const { initialLocation, finalLocation, amount } = req.body;
    // const attributes = Object.keys(Car.rawAttributes);
    // const location = sequelize.literal(
    //     `ST_GeomFromText('POINT(${initialLocation[1]} ${initialLocation[0]})')`
    // );

    // const distance = sequelize.fn(
    //     "ST_DistanceSphere",
    //     sequelize.col("car_location"),
    //     location
    // );
    // attributes.push([distance, "distance"]);
    // let nearByCars = await Car.findAll({
    //     attributes,
    //     order: [[distance, "ASC"]],
    //     where: sequelize.and(
    //         {
    //             status: "open",
    //         },
    //         sequelize.where(distance, Sequelize.Op.lte, maxDistance)
    //     ),
    // });
    const location = `'SRID=4326;POINT(${initialLocation[1]} ${initialLocation[0]})'::geometry`;
    const nearByCars = await sequelize.query(
        `SELECT id, status, ST_DistanceSphere(
            ${location},
            location
        ) AS distanceInMeters
        FROM cars
        WHERE status = 'open'
        ORDER BY cars.location <-> ${location}
        LIMIT 1;`
    );
    // console.log(nearByCars);
    const newBooking = await Booking.create({
        userId: req.user.id,
        initialLocation,
        finalLocation,
        status: "inTransit",
        amount,
        carId: nearByCars[0][0].id,
    });

    await Car.update(
        {
            status: "inTransit",
        },
        {
            where: {
                id: nearByCars[0][0].id,
            },
        }
    );

    res.status(201).json({
        message: "Booking created",
        data: newBooking,
    });
});

exports.getUserBookings = catchError(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10);
    const skip = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
        where: {
            userId: req.user.id,
        },
        offset: skip,
        limit,
        include: [
            {
                model: Car,
                attributes: ["model", "type", "id"],
            },
        ],
    });
    const pageCount = Math.ceil(bookings.count / limit);
    res.status(200).json({
        ok: true,
        total: bookings.count,
        data: bookings.rows,
        hasMore: paginate.hasNextPages(req)(bookings.count),
        pages: paginate.getArrayPages(req)(limit, pageCount, page),
    });
});

exports.updateBooking = catchError(async (req, res, next) => {
    const booking = await Booking.findOne({
        where: {
            userId: req.user.id,
            status: "inTransit",
        },
    });

    if (!booking) {
        res.status(404).json({
            ok: false,
            message: "Not Found",
        });
    }
    await Car.update(
        {
            status: "open",
        },
        {
            where: {
                id: booking.carId,
            },
        }
    );

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({
        ok: true,
        message: "Updated",
    });
});
