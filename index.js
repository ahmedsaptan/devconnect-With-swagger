require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const usersRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profile');
const postsRouter = require('./routes/api/posts');
const api = require('express-list-endpoints-descriptor')(express);

const listEndpoints = require('express-list-endpoints');

require('./db/db')();

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);

const objs = {
	swagger: '2.0',
	info: {
		version: '1.0.0',
		title: 'Simple API',
		description: 'A simple API to learn how to write OpenAPI Specification'
	},
	schemes: ['http'],
	host: 'localhost:5000',
	basePath: '/',
	paths: {}
};

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(require('./swagger.json'))
);

const paths = {};
// app._router.stack.forEach(layer => {
// 	let newPath = {};
// 	if (layer.handle.stack) {
// 		layer.handle.stack.forEach(R => {
// 			let parameters = [];
// 			if (R.keys.length > 0) {
// 				R.keys.forEach(({ name, optional }) => {
// 					parameters.push({
// 						name: name,
// 						required: optional,
// 						in: 'path'
// 					});
// 				});
// 			}
// 			paths[R.route.path] = {};
// 			let method = null;
// 			if (R.route.methods['post'] === true) {
// 				method = 'post';
// 			} else if (R.route.methods['get'] === true) {
// 				method = 'get';
// 			} else if (R.route.methods['put'] === true) {
// 				method = 'put';
// 			} else if (R.route.methods['delete'] === true) {
// 				method = 'delete';
// 			}
// 			if (method === 'put' || method === 'post') {
// 				parameters.push({
// 					name: 'body',
// 					in: 'body',
// 					description: 'Body Object',
// 					required: false
// 				});
// 			}
// 			// console.log(parameters);
// 			paths[R.route.path][method] = {};
// 			paths[R.route.path][method]['parameters'] = parameters;
// 			paths[R.route.path][method]['responses'] = {};
// 			paths[R.route.path][method]['responses']['200'] = {};
// 			// console.log('------------------------------------------------------');
// 		});
// 	}
// });
// console.log(JSON.stringify(paths, null, 4));
// objs['paths'] = paths;
String.prototype.replaceAt = function(index, char) {
	var a = this.split('');
	a[index] = char;
	return a.join('');
};
const m2s = require('mongoose-to-swagger');

const User = require('./models/User');
const Post = require('./models/Post');
const Profile = require('./models/Profile');

console.log(m2s(User));
// console.log(m2s(Post));
// console.log(m2s(Profile));

const getQueryParamsFromRoute = r => {
	let params = [];
	let found = false;
	let startIndex = null;
	let endIndex = null;
	for (let i = 0; i < r.length; i++) {
		if (r[i] == ':') {
			r = r.replaceAt(i, '{');
			found = true;
			startIndex = i + 1;
		}

		if (found && r[i] == '/') {
			found = false;
			endIndex = i;
			var res = r.substring(startIndex, endIndex);
			r = r.replaceAt(i, '}/');
			params.push(res);
		}
	}
	return { route: r, params };
};

const allRoutes = listEndpoints(app);
console.log(allRoutes);
allRoutes.forEach(route => {
	let newparameters;
	parametersAndNewRoute = null;

	parametersAndNewRoute = getQueryParamsFromRoute(route.path + '/');
	// console.log(parametersAndNewRoute);

	paths[parametersAndNewRoute.route] = {};
	route.methods.forEach(method => {
		method = method.toLowerCase();
		newparameters = null;
		paths[parametersAndNewRoute.route][method] = {};
		paths[parametersAndNewRoute.route][method]['parameters'] = [];

		parametersAndNewRoute.params.forEach(p => {
			// console.log(parametersAndNewRoute.route);
			paths[parametersAndNewRoute.route][method]['parameters'].push({
				name: p,
				in: 'path',
				description: 'search string',
				required: true,
				type: 'string'
			});
		});

		// if (method == 'get') {
		// }
		// paths[route.path][method]['responses'] = {};
		// paths[route.path][method]['responses']['200'] = {};
		// paths[route.path][method]['responses']['200']['content'] = {};
		// paths[route.path][method]['responses']['200']['content'][
		// 	'application/json'
		// ] = {};
		// paths[route.path][method]['responses']['200']['content'][
		// 	'application/json'
		// ]['schema'] = {};

		let models = route.path.split('/');
		// console.log(models);
		let model = models[2];

		if (model == 'posts' && models.length == 3) {
			// console.log(models);
			if (method == 'post' || method == 'put') {
				paths[parametersAndNewRoute.route][method]['parameters'].push({
					name: 'body',
					in: 'body',
					description: 'Body Object',
					required: false,
					schema: m2s(Post)
				});
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					description: 'successful operation'
				};
			} else if (method == 'get') {
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {};
				paths[parametersAndNewRoute.route][method]['responses'][
					'200'
				].schema = {
					type: 'array',
					items: m2s(Post)
				};
			}
		} else if (model == 'profile' && models.length == 3) {
			if (method == 'post' || method == 'put') {
				paths[parametersAndNewRoute.route][method]['parameters'].push({
					name: 'body',
					in: 'body',
					description: 'Body Object',
					required: false,
					schema: m2s(Profile)
				});
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					description: 'successful operation'
				};
			} else if (method == 'get') {
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					schema: m2s(Profile)
				};
			}
		} else if (model == 'profile' && models.length == 4) {
			if (method == 'get') {
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					schema: m2s(Profile)
				};
			} else if (method == 'put') {
				// console.log(models);

				paths[parametersAndNewRoute.route][method]['parameters'].push({
					name: 'body',
					in: 'body',
					description: 'Body Object',
					required: false,
					schema: m2s(Profile)['properties'][models[3]].items
				});
			}
		} else if (model == 'profile' && models.length == 5) {
			if (method == 'get') {
				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					schema: m2s(Profile)
				};
			}
		} else if (model == 'auth') {
		} else if (model == 'users' && models.length == 3) {
			if (method == 'post' || method == 'put') {
				paths[parametersAndNewRoute.route][method]['parameters'].push({
					name: 'body',
					in: 'body',
					description: 'Body Object',
					required: false,
					schema: m2s(User)
				});

				paths[parametersAndNewRoute.route][method]['responses'] = {};
				paths[parametersAndNewRoute.route][method]['responses']['200'] = {
					description: 'successful operation'
				};
			}
		}
	});
});

objs['paths'] = paths;
// console.log(JSON.stringify(objs, null, 4));

// const fs = require('fs');
// fs.writeFile('swagger.json', JSON.stringify(objs, null, 4), 'utf8', err => {
// 	console.log('done');
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is start at port : ${PORT}`);
});
