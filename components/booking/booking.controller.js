const {
    models: { Booking, Car },
} = require("../index");

exports.initiateBooking = async (context) => {};

exports.createBooking = async (req, res) => {
    const { status, initialLocation, finalLocation, amount } = req.body;

    const booking = await Booking.create({
        status,
        initialLocation,
        finalLocation,
        amount,
    });

    res.json({ data: { booking } });
};

exports.get_user_bookings = async (req, res, next) => {
    const pageskip = parseInt(process.env.PAGE_SIZE, 10) * parseInt(req.query.page, 10);
    const pageitem = parseInt(process.env.PAGE_SIZE, 10);

    const bookings = await Booking.findAll({
        where: {
            user_id: req.userData.userId,
        },
        offset: pageskip,
        limit: pageitem,
        include: [
            {
                model: Car,
            },
        ],
    });
    res.status(200).json({
        bookings,
    });
};

exports.createUserBooking = async (req, res, next) => {
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

    const { initialLocation, finalLocation, amount, maxDistance } = req.body;
    const attributes = Object.keys(Car.rawAttributes);
    const location = sequelize.literal(
        `ST_GeomFromText('POINT(${initialLocation[0]} ${initialLocation[1]})')`
    );
    const distance = sequelize.fn(
        "ST_DistanceSphere",
        sequelize.col("car_location"),
        location
    );
    attributes.push([distance, "distance"]);
    let instances = await Car.findAll({
        attributes,
        order: [[distance, "ASC"]],
        where: sequelize.and(
            {
                status: "open",
            },
            sequelize.where(distance, Sequelize.Op.lte, maxDistance)
        ),
    });

    const newBooking = await Booking.create({
        userId: req.user.id,
        initialLocation,
        finalLocation,
        status: "inTransit",
        amount,
        carId: instances[0].id,
    });

    const bookingId = newBooking.id;
    await Car.update(
        {
            car_status: "inTransit",
        },
        {
            where: {
                id: instances[0].id,
            },
        }
    );

    res.status(201).json({
        bookingId,
        message: "Booking created",
    });
};

exports.bookings_update = async (req, res, next) => {
    let booking = {};
    try {
        booking = await Booking.findOne({
            where: {
                user_id: req.userData.userId,
                booking_status: "inTransit",
            },
        });
    } catch (err) {
        next(errorInit(`${err.message}database connection error`, 500));
    }
    if (!booking) {
        res.status(404).json({
            message: "Not Found",
        });
    } else {
        try {
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
        } catch (err) {
            next(errorInit(`${err.message}database connection error`, 500));
        }
        booking.booking_status = req.body.status_up;
        await booking.save();

        res.status(200).json({
            message: "Updated",
        });
    }
};
