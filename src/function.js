const { Kafka } = require("kafkajs");
const faker = require("faker");
var fs = require("fs");
async function load_producer() {
  var files = fs.readdirSync("./producer");
  for (let i in files) {
    const producers = require("./../producer/" + files[i]);
    for (let j in producers) {
      producer_list[producers[j].id] = {
        config: producers[j],
        producer: await producer_get(producers[j]),
      };
      if (producer_list[producers[j].id].producer == null) {
        producer_list[producers[j].id].config.connection_status = "Invalid";
      } else {
        producer_list[producers[j].id].config.connection_status = "Valid";
      }
    }
  }
}
async function producer_get(config) {
  try {
    const kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
    });
    const producer = kafka.producer();
    await producer.connect();
    return producer;
  } catch (err) {
    return null;
  }
}
async function producer_start(obj) {
  if (obj.producer == null) obj.producer = await producer_get(obj.config);
  while (obj.config.status) {
    await produce(obj.producer, obj.config.topic, obj.config.messages);
    await sleep(
      obj.config.repeat.min +
        Math.random() * (obj.config.repeat.max - obj.config.repeat.min)
    );
  }
}
async function produce(producer, topic, messages) {
  if (producer != null) {
    let messages_local = JSON.parse(JSON.stringify(messages));
    messages_local.forEach(function (part, i, arr) {
      arr[i].key = faker.fake(arr[i].key);
      arr[i].value = faker.fake(arr[i].value);
    });
    await producer.send({
      topic: topic,
      messages: messages_local,
    });
    return { message: "Message Produced" };
  } else {
    return { Message: "Invalid Producer" };
  }
}
async function produce_dynamic(clientId, brokers, topic, messages) {
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
module.exports = { load_producer, producer_start, produce_dynamic };
