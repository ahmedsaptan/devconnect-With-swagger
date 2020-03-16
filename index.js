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
  "basePath": "/",
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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require("./myjsonfile.json")));


// paths = {}
// app._router.stack.forEach(layer => {
//     let newPath = {}
//     if (layer.handle.stack) {
//         layer.handle.stack.forEach(R => {
//             paths[R.route.path] = {}
//             newPath[R.route.path] = {};
//             let method = null;
//             if(R.route.methods['post'] === true) {
//                 method = "post"
//             } else if(R.route.methods['get'] === true) {
//                 method = "get"
//             }else if(R.route.methods['put'] === true) {
//                 method = "put"
//             }else if(R.route.methods['delete'] === true){
//                 method = "delete"
//             }
//             newPath[R.route.path][method] = {};
//             newPath[R.route.path][method]['responses'] = {}
//             newPath[R.route.path][method]['responses']["200"] = {}
//             console.log(R.route.path)
//             console.log(R.route.methods)
//             paths[R.route.path] = newPath
//             console.log(JSON.stringify(newPath, null, 4))
//             console.log("------------------------------------------------------");
//         })
//     }
//     // console.log(newPath)
//     // objs['paths'] = newPath;
//     // console.log(objs)
// });

// objs['paths'] = paths;
// const  fs = require('fs');
// fs.writeFile('myjsonfile.json', JSON.stringify(objs, null, 4), 'utf8' ,(err) => {
//     console.log("done")
// });



const m2s = require('mongoose-to-swagger');
const User = require("./models/User");
const Post = require("./models/Post");
const Profile = require("./models/Profile");

// console.log(m2s(User));
// console.log(m2s(Post));
// console.log(m2s(Profile))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is start at port : ${PORT}`);
});
