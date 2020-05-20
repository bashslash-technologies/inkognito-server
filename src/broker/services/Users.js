const Utils = require("../utility");
const {random} = require('lodash');

const UserService = ({ ORM }) => {
	//REGISTERATON
		//register a user
		const create = async ({email, contact, name, password, role}) => {
			try {
				let _user = await ORM.Users.findOne({ $or: [{email, contact}]});
				if(_user) throw new Error("User already exists");
				let __user = new ORM.Users({
					email,
					contact,
					hash: password,
					name,
					role,
					util: {
						verification: {
							code: random(99999)
						},
					}
				})
				await __user.save()
				return ({
					user: __user,
					token: await __user.generateAuthToken();
				});
			}
			catch (err) {
				throw err
			}
		};
		//setup a user
		const setup = async (user_id, {licence, identification}) => {
			try {
				let __user = await ORM.Users.findById(user_id);
				if(!__user) throw new Error('User not found')
				let updates = {
					$set: {
						documents: {}
					}
				};
				if(!(licence && licence.number && licence.certificate)){
					throw new Error("Please provide a licence")
				}
				updates['$set']['documents']['licence'] = {
					number: licence.number,
					certificate: licence.certificate,
					verified: false,
				};
				if(__user.role === "VENDOR"){
					if(!(identification && identification.number && identification.certificate && identification.id_type)){
						throw new Error("Please provide a form of identification")
					}
					updates['$set']['documents']['identification'] = {
						number: identification.number,
						certificate: identification.certificate,
						id_type: identification.id_type,
						verified: false,
					};
				}
				await __user.updateOne(
					updates
				, {
					new: true,
				})
				return ({
					user: __user,
					token: await __user.generateAuthToken(),
				});
			}
			catch (err) {
				throw err
			}
		};

	//AUTHENTICATION
		// authenticate a user into the system
		const login = async ({username}) => {
			try {
				let __user = await ORM.Users.findOne({ $or: [{email: username, contact: username}]});
				if (!__user) throw new Error("account not found");
				if (!__user.isVerified) throw new Error("account not verified");
				let isValid = await __user.comparePasswords(password);
				if (!isValid) throw new Error("incorrect password");
				return ({
					user: __user,
					token: await __user.generateAuthToken(),
				});
			}
			catch (err) {
				throw err
			}
		};

	//VERIFICATION
		//verify a user contact
		const verifyContact = async ({params}) => {
			try {
				let __user =
				return;
			}
			catch (err) {
				throw err
			}
		};
		//send verification
		const verifyContact = async ({params}) => {
			try {
				let __user =
				return;
			}
			catch (err) {
				throw err
			}
		};

	return {
		create,
		setup,
		login
	};
};

module.exports = UserService;
