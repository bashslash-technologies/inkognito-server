API_BASE_PATH = '/api/v1';

API_ROUTES = {
	categories: [
		{
			name: 'create category',
			path: '/categories/',
			method: 'POST',
			body: {
				'name': String,
				'description': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'retrieve categories',
			path: '/categories/',
			method: 'GET',
			body: {},
			query: {},
			params: {},
		},
	],
	courier: [
		{
			name: 'create courier',
			path: '/couriers/',
			method: 'POST',
			body: {},
			query: {},
			params: {},
		},
		{
			name: 'retrieve all couriers',
			path: '/couriers/',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number,
			},
			params: {},
		},
		{
			name: 'retrieve courier',
			path: '/couriers/:courier_id',
			method: 'GET',
			body: {},
			query: {},
			params: {
				'courier_id': String,
			},
		},
		{
			name: 'verify courier',
			path: '/couriers/verify',
			method: 'POST',
			body: {
				'courier_id': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'check courier wallet balance',
			path: '/couriers/wallet/:courier_id',
			method: 'GET',
			body: {},
			query: {},
			params: {
				'courier_id': String,
			},
		},
		{
			//in progress
			name: 'cashout courier balance',
			path: '/couriers/cashout',
			method: 'POST',
			body: {
				'courier_id': String,
				'amount': Number,
			},
			query: {},
			params: {},
		},
	],
	orders: [
		{
			name: 'create an order',
			path: '/orders/',
			method: 'POST',
			body: {
				
			},
			query: {},
			params: {},
		},
		{
			name: 'update order to ready',
			path: '/orders/ready',
			method: 'POST',
			body: {
				'order_id': String,
				'shop_id': String,
			},
			query: {},
			params: {},
		},
		{
			//in progress
			name: 'update order',
			path: '/orders/',
			method: 'PUT',
			body: {
				
			},
			query: {},
			params: {},
		},
		{
			name: 'retrieve all orders',
			path: '/orders/',
			method: 'GET',
			body: {},
			query: {
				'page': String,
				'size': String,
			},
			params: {},
		},
		{
			name: 'retrieve user orders',
			path: '/orders/user',
			method: 'GET',
			body: {},
			query: {
				'page': String,
				'size': String,
			},
			params: {},
		},
		{
			name: 'retrieve shop orders',
			path: '/orders/shop',
			method: 'GET',
			body: {},
			query: {
				'page': String,
				'size': String,
				'shop_id': String,
			},
			params: {},
		},
		{
			name: 'get price of delivery',
			path: '/orders/pricing',
			method: 'POST',
			body: {
				'user_location': {
					'longitude': Number,
					'latitude': Number,
				},
				'shop_ids': [String]
			},
			query: {},
			params: {},
		},
	],
	products: [
		{
			name: 'create a product',
			path: '/products/',
			method: 'POST',
			body: {
				'shop_id': String,
				'name': String,
				'images': File,
				'price': Number,
				'description': String,
				'categories': [String],
			},
			query: {},
			params: {},
		},
		{
			name: 'update a product',
			path: '/products/',
			method: 'PUT',
			body: {
				'product_id': String,
				'name': String,
				'images': Buffer,
				'description': String,
				'categories': [String],
			},
			query: {},
			params: {},
		},
		{
			name: 'delete a product',
			path: '/products/:product_id',
			method: 'DELETE',
			body: {},
			query: {},
			params: {
				'product_id': String,
			},
		},
		{
			name: 'retrieve all products',
			path: '/products/',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number,
			},
			params: {},
		},
		{
			name: 'retrieve a shops product',
			path: '/products/shop/:shop_id',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number,
			},
			params: {
				'shop_id': String,
			},
		},
	],
	shops: [
		{
			name: 'create a shop',
			path: '/shops/',
			method: 'POST',
			body: {
				'name': String,
				'location': {
					'longitude': Number,
					'latitude': Number,
				},
				'certificate': File,
				'certificate_number': String,
				'description': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'update a shops details',
			path: '/shops/',
			method: 'PUT',
			body: {
				'shop_id': String,
				'location': {
					'longitude': Number,
					'latitude': Number,
				},
				'description': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'update a shops logo',
			path: '/shops/logo',
			method: 'PUT',
			body: {
				'shop_id': String,
				'logo': File,
			},
			query: {},
			params: {},
		},
		{
			name: 'retrieve all shops',
			path: '/shops/',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number
			},
			params: {},
		},
		{
			name: 'retrieve a shop',
			path: '/shops/:shop_id',
			method: 'GET',
			body: {},
			query: {},
			params: {
				'shop_id': String,
			},
		},
		{
			name: 'retrieve a shops wallet',
			path: '/shops/wallet/:shop_id',
			method: 'GET',
			body: {},
			query: {},
			params: {
				'shop_id': String,
			},
		},
		{
			name: 'cashout shop balance',
			path: '/shops/',
			method: 'POST',
			body: {
				'shop_id': String,
				'amount': Number
			},
			query: {},
			params: {},
		},
	],
	trips: [
		{
			name: 'retrieve all trips',
			path: '/trips/',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number,
			},
			params: {},
		},
		{
			name: 'retrieve all open trips',
			path: '/trips/open',
			method: 'GET',
			body: {},
			query: {
				'longitude': Number,
				'latitude': Number,
			},
			params: {},
		},
		{
			name: 'retrieve courier trips',
			path: '/trips/courier',
			method: 'GET',
			body: {},
			query: {
				'page': Number,
				'size': Number,
			},
			params: {},
		},
		{
			name: 'accept a trip',
			path: '/trips/accept/:trip_id',
			method: 'POST',
			body: {},
			query: {},
			params: {
				'trip_id': String,
			},
		},
		{
			name: 'start a trip',
			path: '/trips/start/:trip_id',
			method: 'POST',
			body: {},
			query: {},
			params: {
				'trip_id': String,
			},
		},
		{
			name: 'end a trip',
			path: '/trips/end/:trip_id',
			method: 'POST',
			body: {},
			query: {},
			params: {
				'trip_id': String,
			},
		},
	],
	users: [
		{
			name: 'retrieve all users',
			path: '/users/',
			method: 'GET',
			body: {},
			query: {
				'role': String,
				'page': Number,
				'size': Number,
			},
			params: {},
		},
		{
			name: 'register a user',
			path: '/users/register/',
			method: 'POST',
			body: {
				'email': String,
				'phone': String,
				'name': String,
				'password': String,
				'role': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'authenticate a user',
			path: '/users/login/',
			method: 'POST',
			body: {
				'username': String,
				'password': String,
				'role': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'verify a user',
			path: '/users/verify',
			method: 'POST',
			body: {
				'username': String,
				'code': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'send verification message',
			path: '/users/verify',
			method: 'GET',
			body: {},
			query: {
				'username': String,
			},
			params: {},
		},
		{
			name: 'verify reset code',
			path: '/users/reset',
			method: 'POST',
			body: {
				'username': String,
				'code': String,
			},
			query: {},
			params: {},
		},
		{
			name: 'send reset message',
			path: '/users/reset',
			method: 'GET',
			body: {},
			query: {
				'username': String,
			},
			params: {},
		},
		{
			name: 'reset user password',
			path: '/users/password',
			method: 'POST',
			body: {
				'password': String,
			},
			query: {},
			params: {},
		},
	]
};

SOCKET_NAMESPACE = '/v1';

SOCKET_EVENTS = {
	courier: {
		emit: [
			{
				name: 'emit location for galamsey',
				event: 'mep3_galamsey',
				body: {
					'user_id': String,
					'location': {
						'longitude': Number,
						'latitude': Number,
					}
				},
				callback: null,
			},
		],
		listen: [
			{
				name: 'listen for galamseys around you',
				event: 'galamsey-woha',
				data: [Trips],
				callback: null,
			},
			{
				name: 'listen for galamseys around you',
				event: '[courier_id]-galamsey-woha',
				data: [Trips],
				callback: null,
			},
		],
	},
	shop: {
		emit: [],
		listen: [
			{
				name: 'listen for orders',
				event: '[shop_id]-adwuma-aba',
				data: [Order],
				callback: null,
			},
		],
	}
}