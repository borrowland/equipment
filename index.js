const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//init ETCD and watch variables
var config = require("./etcd/EtcdInit");

var user = process.env.DB_USER || "root";
var password = process.env.DB_PASSWORD || "password";
var db_uri = process.env.DB_URI || "192.168.99.100:27017";

mongoose.connect(`mongodb://${user}:${password}@${db_uri}/equipment?authSource=admin`, {
    useNewUrlParser: true
});

var db = mongoose.connection;

const port = process.env.PORT || 8080;
let app = express();
let baseUrl = "/v1";

// body parser must be initiated before any request route
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// init each route separately
app.use(baseUrl + "/equipment", require("./routes/equipmentRoutes"));

// Leave here for easy checking if the app is running.
app.get('/', (req, res) => res.send('<h1> Equipment API running!</h1>'));

// Check configuration
app.get('/etcd', (req, res) => res.send(JSON.stringify(config)));


app.listen(port, function () {
    console.log("Running server on port " + port);
});