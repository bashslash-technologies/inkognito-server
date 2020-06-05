'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../configs');

const ResolveVendor = function(req, res, next){
	const bearer_token = req.headers.authorization;
	if (!bearer_token) return res.status(401).send('access denied, no token provided');
	const token = bearer_token.split(' ')[1];
	if (!token) return res.status(400).send('access denied, invalid token');
	try{
		const decoded = jwt.verify(
			token,
			config.app.secret, {
			issuer: config.app.name
		});
		if (decoded.role !== 'VENDOR') return res.status(403).send('access denied, insufficient permissions');
		req.user_id = decoded._id;
		next();
	} catch (err){
		res
			.status(400)
			.send('access denied, invalid token')
	}
}

module.exports = ResolveVendor;
