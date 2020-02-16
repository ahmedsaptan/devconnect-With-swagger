require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

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

app.get('/', (req, res) => {
	res.send('API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is start at port : ${PORT}`);
});

