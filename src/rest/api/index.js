const { Router } = require("express");

const AllRoutes = (broker) => {
    const router = Router();
    router.get("/", (req, res) => {
        res.send("Apis working");
    });

    router.use("/user", require("./user")(broker));
    router.use("/product", require("./user")(broker));

    return router;
};

module.exports = AllRoutes;
