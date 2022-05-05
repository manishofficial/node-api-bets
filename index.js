require('dotenv').config();

const express = require('express');

const app = express();

const cors = require("cors");

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

const routes = require('./app/api');

app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})