const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("hello");
});

app.listen(8000, () => {
  console.log("Backend is running");
});
