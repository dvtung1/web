/*
    Configure file to initialize Backendless database. Contain all the APP ID and API KEY. Link to Controller
*/

const Backendless = require("backendless");

const APP_ID = "F6915806-92CB-B28C-FF3A-855783395500";
const API_KEY = "DF5D8631-2A3F-B6BE-FF0D-4E8CF263CC00";

Backendless.serverURL = "https://api.backendless.com";
Backendless.initApp(APP_ID, API_KEY);
