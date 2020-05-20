const Utils = require("../utility");

const CategoryService = ({ ORM }) => {
	//create a category
	const create = async ({name, description}) => {
		try {
			let __category = new ORM.Categories({
				name,
				description
			})
			await __category.save();
			return __category;
		}
		catch (err) {
			throw err
		}
	};

	//retrieve all categories
	const read = async () => {
		try {
			return await ORM.Categories.find({});
		}
		catch (err) {
			throw err;
		}
	};

	return {
		create,
		read
	};
};

module.exports = CategoryService;
