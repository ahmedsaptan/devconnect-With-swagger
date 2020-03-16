require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const usersRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profile');
const postsRouter = require('./routes/api/posts');

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
  "swagger": "2.0",
  "info": {
      "version": "1.0.0",
      "title": "Simple API",
      "description": "A simple API to learn how to write OpenAPI Specification"
  },
  "schemes": [
      "https"
  ],
  "host": "simple.api",
  "basePath": "/openapi101",
  "paths": {
      "/persons": {
          "get": {
              "summary": "Gets some persons",
              "description": "Returns a list containing all persons.",
              "responses": {
                  "200": {
                      "description": "A list of Person",
                      "schema": {
                          "type": "array",
                          "items": {
                              "properties": {
                                  "firstName": {
                                      "type": "string"
                                  },
                                  "lastName": {
                                      "type": "string"
                                  },
                                  "username": {
                                      "type": "string"
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
  }
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(objs));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is start at port : ${PORT}`);
});

// const genSwaggerJson = () => {
//   const routes = [];

//    .forEach(middleware => {
//     if (middleware.route) {
//       routes.push(
//         `${Object.keys(middleware.route.methods)} -> ${middleware.route.path}`
//       );
//     }
//   });

//   console.log(JSON.stringify(routes, null, 2));
// };

// genSwaggerJson();

console.log('*******************************************');
app._router.stack.forEach(layer => {
	if (layer.handle.stack) {
		console.log(layer.handle.stack[0].route);
		console.log(layer.handle.stack.length);
		console.log('---------------------');
	}
});

console.log('**********************************************');
