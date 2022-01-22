require("dotenv").config();
const express = require("express");
const app = express();
global.producer_list = {};
app.use(express.json());
app.use("/", require("./routes.js"));
app.listen(process.env.PORT, () => {
  console.log(`Kafka Faker listening at http://localhost:${process.env.PORT}`);
});
var { load_producer } = require("./function");
load_producer();
