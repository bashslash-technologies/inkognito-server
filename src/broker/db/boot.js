const UserService = require('../services/Users');
const ORM = require('./models/Users')

const setDefaultDataForAdmin = async () => {
	try {
		//setup boot here. Super users that need to be in the system before the app starts
		await UserService({ORM}).create({
			email: process.env.ADMIN_EMAIL,
			contact: process.env.ADMIN_CONTACT,
			name: process.env.ADMIN_PHONE,
			password: process.env.ADMIN_PASSWORD,
			role: 'ADMIN'
		})
		console.log("Inkognito booted successfully");
	} catch (err) {
		console.log(err)
	}
};

module.exports = async () => {
	await setDefaultDataForAdmin();
};
