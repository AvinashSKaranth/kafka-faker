const express = require("express");
const app = express();
const port = 9091;
const { Kafka } = require("kafkajs");
const faker = require("faker");
var fs = require("fs");
const e = require("express");
var producer_list = {};
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/produce", (req, res) => {
  produce(
    req.body.client_id,
    req.body.brokers,
    req.body.topic,
    req.body.messages
  ).then((result) => {
    res.send(result);
  });
});
app.get("/producer/:id/start", (req, res) => {
  if (producer_list.hasOwnProperty(req.params.id)) {
    producer_list[req.params.id].status = true;
    start_producer(producer_list[req.params.id]);
    res.send({
      message: "Producer Started",
      producer: producer_list[req.params.id],
    });
  } else {
    res.send({ message: "No Producer with that ID" });
  }
});
app.get("/producer/:id/stop", (req, res) => {
  if (producer_list.hasOwnProperty(req.params.id)) {
    producer_list[req.params.id].status = false;
    res.send({
      message: "Producer Stopped",
      producer: producer_list[req.params.id],
    });
  } else {
    res.send({ message: "No Producer with that ID" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
load_producer();
async function load_producer() {
  var files = fs.readdirSync("./producer");
  for (let i in files) {
    const config = require("./../producer/" + files[i]);
    for (let j in config) {
      producer_list[config[j].id] = config[j];
      start_producer(config[j]);
    }
  }
}
async function start_producer(config) {
  while (config.status) {
    await produce(
      config.client_id,
      config.brokers,
      config.topic,
      config.messages
    );
    await sleep(
      config.repeat.min +
        Math.random() * (config.repeat.max - config.repeat.min)
    );
  }
}
async function produce(clientId, brokers, topic, messages) {
  try {
    let messages_local = JSON.parse(JSON.stringify(messages));
    messages_local.forEach(function (part, i, arr) {
      arr[i].value = faker.fake(arr[i].value);
    });
    const kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: topic,
      messages: messages_local,
    });
    await producer.disconnect();
    return { message: "Message produced" };
  } catch (err) {
    return { message: err.message };
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
