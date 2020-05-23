const mongoose = require("mongoose");
const boot = require("./boot");

const createConnection = async ({DB_URI}) => {
    await mongoose
        .connect(DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(async () => {
            console.log(`** Database on ${DB_URI}`);
            await require("./models/Counters").findOneAndUpdate(
                {_id: "orders"},
                {},
                {upsert: true, new: true, setDefaultsOnInsert: true}
            );
        })
        .catch((err) => {
            console.error(err);
        });

    let Cashouts = require("./models/Cashouts");
    let Categories = require("./models/Categories");
    let Counters = require("./models/Counters");
    let Orders = require("./models/Orders");
    let Products = require("./models/Products");
    let Transactions = require("./models/Transactions");
    let Trips = require("./models/Trips");
    let Users = require("./models/Users");
    let SubOrders = require("./models/SubOrders");

    //boot system
    await boot();

    //return the models
    return {
        Cashouts,
        Categories,
        Counters,
        Orders,
        Products,
        Transactions,
        Trips,
        Users,
        SubOrders,
    };
};

module.exports = createConnection;
