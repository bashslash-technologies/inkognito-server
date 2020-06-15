'use strict';

const {Shop, User, Category} = require('../../models/v1');
const storageService = require('./storage');

async function createCategory(admin_id, {name, description}) {
	try {
		let __category = await Category.findOne({name: name});
		if(__category) throw new Error('category already exits');
		__category = new Category({
			name: name,
			description: description,
		});
		await __category.save();
		return {
			category: __category,
		};
	}
	catch (err) {
		throw err;
	}
}

async function retrieveCategories(user_id) {
	try {
		let __categories = await Category.find({});
		return {
			categories: __categories,
		};
	}
	catch (err) {
		throw err;	
	}
}

module.exports = {
	createCategory: createCategory,
	retrieveCategories: retrieveCategories,
};