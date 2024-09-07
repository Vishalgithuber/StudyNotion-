const mongoose = require('mongoose');
require("dotenv").config();


exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => {
            console.log("DB connection Failed");
            console.log(err);
            process.exit(1);
        });
};