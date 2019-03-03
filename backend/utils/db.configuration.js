/*
    Configure file to initialize Backendless database. Contain all the APP ID and API KEY. Link to Controller
*/

const Backendless = require("backendless");

const APP_ID = "A171E34C-C953-9E1F-FF12-863BEC79D400";
const API_KEY = "8C2EB010-DABF-60AC-FF6B-03DBF4813000";

Backendless.initApp(APP_ID, API_KEY);
Backendless.serverURL = "https://api.backendless.com";

module.exports = Backendless;