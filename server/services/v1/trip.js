'use strict';

const _ = require('lodash');
const {User, Trip} = require('../../models/v1');
const locationService = require('./location');
const paymentService = require('./payment');

async function acceptTrip(courier_id, {trip_id}) {
	try {
		let __user = await User.findById(courier_id);
		if(!__user) throw new Error("account not found");
		let __trip = await Trip.find({_id: trip_id, ready: true, courier_id: null});
		if(!__trip) throw new Error("trip not found");
		__trip.courier_id = courier_id;
		await __trip.save();
		return {
			trip: __trip,
		};
	}
	catch (err) {
		throw err;
	}
}

async function startTrip(courier_id, {trip_id}) {
	try {
		let __user = await User.findById(courier_id);
		if(!__user) throw new Error("account not found");
		let __trip = await Trip.find({_id: trip_id, courier_id: courier_id});
		if(!__trip) throw new Error("trip not found");
		__trip.start_time = new Date();
		await __trip.save();
		return {
			trip: __trip,
		};
	}
	catch (err) {
		throw err;
	}
}

async function endTrip(courier_id, {trip_id}) {
	try {
		let __user = await User.findById(courier_id);
		if(!__user) throw new Error("account not found");
		let __trip = await Trip.find({_id: trip_id, courier_id: courier_id});
		if(!__trip) throw new Error("trip not found");
		__trip.end_time = new Date();
		await __trip.save();
		return {
			trip: __trip,
		};
	}
	catch (err) {
		throw err;
	}
}

async function retrieveCourierTrips(courier_id) {
	try {
		let __user = await User.findById(courier_id);
		if(!__user) throw new Error("account not found");
		let __trips = await Trip.find({courier_id: courier_id})
			.limit(size)
			.skip(page*size);
		return {
			trips: __trips,
		};
	}
	catch (err) {
		throw err;
	}
}

async function retrieveTrips(admin_id, {page, size}) {
	try {
		let __trips = await Trip.find({})
			.limit(size)
			.skip(page*size);
		return {
			trips: __trips,
		};
	}
	catch (err) {
		throw err;
	}
}

async function retrieveOpenTrips(courier_id, {longitude, latitude}) {
	try {
		let __user = await User.findById(courier_id);
		if(!__user) throw new Error("account not found");
		let __trips = await Trip.find({
			start_point: {
				$near: {
					$maxDistance: 1000,
					$geometry: {
						type: "Point",
						coordinates: [longitude, latitude]
					}
				}
			},
			courier_id: null,
			ready: true
		});
		return {
			trips: __trips,
		};
	}
	catch (err) {
		throw err;	
	}
}

module.exports = {
	acceptTrip: acceptTrip,
	startTrip: startTrip,
	endTrip: endTrip,
	retrieveCourierTrips: retrieveCourierTrips,
	retrieveOpenTrips: retrieveOpenTrips,
	retrieveTrips: retrieveTrips,
};