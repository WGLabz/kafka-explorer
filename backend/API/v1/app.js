var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var app = express();
import { initDB } from "../../persistence";
var http = require('http');

initDB();
// Routes
var logRouter = require("./routes/log");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/log", logRouter);

app.set('port', 9003);

var server = http.createServer(app);
server.listen(9003);

// module.exports = app;


