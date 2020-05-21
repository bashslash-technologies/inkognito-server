const jwt = require("jsonwebtoken");

let roles = ['VENDOR', 'ADMIN', 'DELIVERY'];

const ResolveProviders = function(req, res, next){
	const bearer_token = req.headers.authorization;
	if (!bearer_token) return res.status(401).send('access denied, no token provided');
	const token = bearer_token.split(' ')[1];
	if (!token) return res.status(400).send('access denied, invalid token');
	try{
		const decoded = jwt.verify(
			token,
			process.env.APP_SECRET, {
			issuer: 'inkognito'
		});
		if (!roles.includes(decoded.role)) return res.status(403).send('access denied, insufficient permissions');
		req.user_id = decoded.user_id;
		next();
	} catch (err){
		res.status(400).send('access denied, invalid token')
	}
}

module.exports = ResolveProviders;
