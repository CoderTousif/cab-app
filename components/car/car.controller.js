const catchError = require("../../utils/catch-async-err");
// const { Op } = require("sequelize");
const {
    models: { Car },
    sequelize,
} = require("../index");

exports.createCar = catchError(async (request, response, next) => {
    const { model, status, registrationNo, location, type } = request.body;
    const user = request.user;
    // console.log(location);
    const car = await Car.create({
        model,
        status,
        registrationNo,
        type,
        userId: user.id,
        location,
    });

    response.send({ ok: true, data: car });
});

exports.getNearbyCars = catchError(async (request, response, next) => {
    const { lng, lat } = request.query;

    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    const location = `'SRID=4326;POINT(${longitude} ${latitude})'::geometry`;
    // const location = `ST_GeomFromText('POINT(${longitude} ${latitude})')`;
    // better solution
    const nearByCars = await sequelize.query(
        `SELECT id, model, location, type, status, ST_DistanceSphere(
            ${location},
            location
        ) AS distance 
        FROM cars
        WHERE status = 'open'
        ORDER BY cars.location <-> ${location}
        LIMIT 5;`
    );
    // const attributes = Object.keys(Car.rawAttributes);

    // const geoLocation = sequelize.literal(
    //     `ST_GeomFromText('POINT(${longitude} ${latitude})')`
    // );
    // const distance = sequelize.fn(
    //     "ST_DistanceSphere",
    //     sequelize.col("location"),
    //     geoLocation
    // );
    // attributes.push([distance, "distance"]);
    // console.log(attributes);
    // const nearByCars = await Car.findAll({
    //     attributes,
    //     where: sequelize.and(
    //         {
    //             status: "open",
    //         },
    //         sequelize.where(distance, Op.ne, null)
    //     ),
    //     order: [[distance, "ASC"]],
    //     limit: 5,
    // });
    // console.log(nearByCars);

    response.status(200).json({ ok: true, data: nearByCars[0] });
});

exports.updateLocation = catchError(async (request, response, next) => {
    const { location } = request.body;

    const car = await Car.findAndUpdate({
        location,
    });

    return car;
});

exports.updateStatus = async (request, response, next) => {
    const { status } = request.body;

    const car = await Car.findAndUpdate({
        status,
    });

    return car;
};
