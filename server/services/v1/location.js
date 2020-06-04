'use strict';

const async = require('async');
const _ = require('lodash');
const haversine = require('haversine');
const cache = require('../../cache');
const config = require('../../../configs');

function setLocation(user_id, location) {
	cache.set(
		user_id,
		JSON.stringify({
			"location": location,
			"last_seen": new Date()
		}),
		function(err, data) {
			if(err) {
				console.log(err)
			}
			else {
				console.log(data)
			}
		}
	)
}



async function getTrips({longitude, latitude}) {
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
		return __trips;
}

function getFence(location) {
	cache.keys('*', function(err, courier_ids) {
		if (err) {
			return console.log(err)
		}
		if (courier_ids) {
			async.map(
				courier_ids,
				function(courier_id, cb) {
				cache.get(courier_id, function (error, data) {
						if (error) return cb(error);
						data = JSON.parse(data)
						cb(null, {
							courier_id,
							data,
						})
					}); 
				},
				function (error, couriers) {
					if (error) return console.log(error);
					let data = couriers.filter(
						(courier) =>(
							(
								haversine(location, courier.data.location, {unit: 'meter'}) < 50
							)
							&& (
								(
									new Date().getTime() - new Date(courier.data.last_seen).getTime()
								) < (
									1000 * 60 * 5
								)
							)
						)
					)
					return data;
				}
			);
		}
	})
}

function calculatePricing(location_a, location_b) {
	try{ 
		let __distance = haversine(location_a, location_b, {unit: 'meter'});
		let __thresholdMapping = config.rates;
		let __express = __distance * config.base_rate;
		for (let index = 0; index < __thresholdMapping.length; index++) {
			if( __distance < __thresholdMapping[index].threshold) {
				__express = __distance * __thresholdMapping[index].rate;
				break;
			}
		}
		let __standard = 15;
		return ({
			standard: __standard,
			express: __express,
		})
	}
	catch(err) {
		throw err;
	}
}

module.exports = {
	setLocation: setLocation,
	getFence: getFence,
	calculatePricing: calculatePricing,
	getTrips: getTrips
}