require("dotenv").config();
const express = require("express");
const app = express();
global.producer_list = {};
app.use(express.json());
app.use("/", require("./routes.js"));
let port = process.env.PORT || 9091;
app.listen(port, () => {
  console.log(`Kafka Faker listening at http://localhost:${port}`);
});
var { load_producer } = require("./function");
load_producer();
