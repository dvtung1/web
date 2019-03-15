/*
  File to run the server 
*/

const app = require("./app");

//if local, use 3000. otherwise, use the deploy service port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running...");
});
