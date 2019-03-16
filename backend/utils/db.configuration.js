/*
    Configure file to initialize Backendless database. Contain all the APP ID and API KEY. Link to Controller
*/

const Backendless = require("backendless");
require("dotenv").config();

const APP_ID = process.env.APP_ID;
const API_KEY = process.env.API_KEY;

Backendless.initApp(APP_ID, API_KEY);
Backendless.serverURL = "https://api.backendless.com";

module.exports = Backendless;
