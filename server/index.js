require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const PORT = process.env.PORT;
const fileUpload = require('express-fileupload');
const path = require('path');

const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

// router
app.use('/api', router);

// Error handler
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();
