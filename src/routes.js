var express = require("express");
var { producer_start, produce } = require("./function");
var router = express.Router();
router.get("/", (req, res) => {
  res.send("Documentation Page");
});
router.post("/produce", (req, res) => {
  produce_dynamic(
    req.body.client_id,
    req.body.brokers,
    req.body.topic,
    req.body.messages
  ).then((result) => {
    res.send(result);
  });
});
router.get("/producer/:id/start", (req, res) => {
  if (producer_list.hasOwnProperty(req.params.id)) {
    producer_list[req.params.id].config.status = true;
    producer_start(producer_list[req.params.id]);
    res.send({
      message: "Producer Started",
      producer: producer_list[req.params.id].config,
    });
  } else {
    res.send({ message: "No Producer with that ID" });
  }
});
router.get("/producer/:id/stop", (req, res) => {
  if (producer_list.hasOwnProperty(req.params.id)) {
    producer_list[req.params.id].config.status = false;
    res.send({
      message: "Producer Stopped",
      producer: producer_list[req.params.id].config,
    });
  } else {
    res.send({ message: "No Producer with that ID" });
  }
});
module.exports = router;
