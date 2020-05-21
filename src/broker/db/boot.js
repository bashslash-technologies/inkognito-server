const User = require("./models/Users");

const setDefaultDataForAdmin = async () => {
    try {
        //setup boot here. Super users that need to be in the system before the app starts
        process.env.ADMIN_CONTACT = "233545526664";
        process.env.ADMIN_EMAIL = "a@b.com";
        process.env.ADMIN_NAME = "Backslash Technologies";
        process.env.ADMIN_PASSWORD = "........";
        let users = await User.find({role: "ADMIN"});
        if (users.length === 0) {
            console.log("No Admin found, creating one");
            await new User({
                email: process.env.ADMIN_EMAIL,
                contact: process.env.ADMIN_CONTACT,
                name: process.env.ADMIN_NAME,
                hash: process.env.ADMIN_PASSWORD,
                role: "ADMIN",
            }).save();
        }
        console.log("Inkognito booted successfully");
    } catch (err) {
        console.log(err);
    }
};

module.exports = async () => {
    await setDefaultDataForAdmin();
};
