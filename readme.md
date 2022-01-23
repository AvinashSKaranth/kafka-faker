# Kafka Faker

## Create a producer json and place it in a folder called producer

./producer/faker.json

```
[
  {
    "id": "1",
    "status": false,
    "client_id": "faker",
    "brokers": ["host.docker.internal:9092"],
    "topic": "test-topic",
    "messages": [
      {
        "key": "{datatype.uuid}",
        "value": "{\"message\": \"This is a Test Message from {{name.findName}}\"}"
      }
    ],
    "repeat": { "min": 1000, "max": 3000 }
  }
]

```

## Docker Run

```
docker run -d --name kafka-faker -v <path/to/producer>:/home/node/app/producer -p 9091:9091 --network=<kafka_network> avinashskaranth/kafka-faker
```

Ensure your kafka and kafka-faker are running in the same network

## Docker Compose with ZooKeeper, Kafka, Kafa Drops and kafka-faker

```
https://github.com/AvinashSKaranth/kafka-faker/blob/master/docker-compose.yml

```

## APIs

- GET /producer/list - List all producer setup in the system
- GET /producer/{id}/start - To Start Producing messages
- GET /producer/{id}/stop - To Stop Producing messages
- GET /producer/{id}/status - To get the config infomation
  Dynamically Produce message without configuration

- POST /produce

JSON BODY

```
{
  "client_id": "faker",
  "brokers": [
    "localhost:9093"
  ],
  "topic": "test-topic",
  "messages": [
    {
      "key": "{{datatype.uuid}}",
      "value": "{\"message\": \"This is a Test Message from {{name.findName}}\"}"
    }
  ]
}
```

This Rest API produces 1 message

## TODO

- Test Cases
- Add/Remove Producers using Rest API /producer/{id}/add /producer/{id}/remove
- Trigger Kafka Produce with GET endpoint /producer/{id}/produce
