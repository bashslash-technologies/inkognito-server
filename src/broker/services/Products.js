const ProductService = ({ ORM }) => {
	const create = async (
		user_id,
	{
		name,
		images,
		description,
		price,
		stock,
		categories,
	}) => {
		try {
			let __product = new ORM.Products({
				vendor: user_id,
				name,
				images,
				description,
				price,
				stock,
				categories,
			});
			await __product.save()
			return await __product.populate('categories -_id -__v name description');
		}
		catch (err) {
			throw err
		}
	};

	const read = async (user_id) => {
		try {
			let products = await ORM.Products.find({vendor: user_id});
			console.log(products)
			return products
		}
		catch (err) {
			throw err
		}
	};

	const readAll = async ({page, size, search}) => {
		try {
			let query = {}
			if(search) {
				query.name = search;
			}
			return await ORM.Products.find(query, {}, {limit: size, skip: page*size})
		}
		catch (err) {
			throw err
		}
	};

	const update = async (
		user_id,
		_id,
		{ name, images, description, price, stock, categories }
	) => {
		try {
			let __product = await ORM.Products.findById(_id);
			if (!__product) throw new Error("Product not found");
			if (__product.seller.toString() !== user_id.toString()) throw new Error("Product not yours")
			await product.updateOne(
				{
					$set: {
						name,
						images,
						description,
						price,
						stock,
						categories,
					},
				}, {
					new: true
				}
			);
			return await __product.populate('categories -_id -__v name description');
		}
		catch (err) {
			throw err
		}
	};

	const destroy = async (_id) => {
		try {
			let __product = await ORM.Products.findById(_id);
			if (!__product) return new Error("Product not found");
			if (__product.seller.toString() !== user_id.toString()) throw new Error("Product not yours")
			//delete the product images
			await __product.delete();
			return true;
		}
		catch (err) {
			throw err
		}
	};

	return {
		create,
		read,
		readAll,
		update,
		destroy
	};
};

module.exports = ProductService;
