'use strict';

const locationService = require('../../services/v1/location');

function init(io) {
	io.on('connection', function(socket) {
		console.log('user connected with socket : ' + socket.id);

		socket.on('mep3_galamsey', async function({user_id, location}) {
			locationService.setLocation(user_id, location);
			let trips = await locationService.getTrips(location);
			if(trips) {
				socket.emit('galamsey_woha', trips);
			}
		});
	});
}

module.exports = init;