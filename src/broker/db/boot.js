const setDefaultDataForAdmin = async () => {
	try {
		//setup boot here. Super users that need to be in the system before the app starts

		console.log("Inkognito booted successfully");
	} catch (e) {
		throw new Error(e);
	}
};

module.exports = async () => {
	await setDefaultDataForAdmin();
};
