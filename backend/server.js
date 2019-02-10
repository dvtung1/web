const app = require("./app");

const port = process.env.PORT || 3000;

//testing with port 3000
app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log("Server running...");
});
