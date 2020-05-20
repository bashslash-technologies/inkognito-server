const ProductService = ({ ORM }) => {
	const create = async ({
		name,
		images,
		description,
		price,
		stock,
		categories,
	}) => {
		try {
			let __product = new ORM.Products({
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

	const read = async () => {
		try {
			return await ORM.Products.find({});
		}
		catch (err) {
			throw err
		}
	};

	const update = async (
		_id,
		{ name, images, description, price, stock, categories }
	) => {
		try {
			let __product = await ORM.Products.findById(_id);
			if (!__product) return new Error("Product not found");
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
		update,
		destroy 
	};
};

module.exports = ProductService;
