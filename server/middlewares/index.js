module.exports = {
	handleError: require('./handleError'),
	handleNotFound: require('./handle404'),
	handleSuccess: require('./handleSuccess'),
	resolveAdmin: require('./resolveAdmin'),
	resolveVendor: require('./resolveVendor'),
	resolveCourier: require('./resolveCourier'),
	resolveUser: require('./resolveUser')
};