const mongoose = require('mongoose');

const connnectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_LOCAL_HOST_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log('Connect To MONGODB...');
	} catch (e) {
		console.log(e.message);
		process.exit(1);
	}
};

module.exports = connnectDB;
