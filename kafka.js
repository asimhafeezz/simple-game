const { Kafka } = require("kafkajs")
const { io } = require("./config")

const kafka = new Kafka({
	brokers: ["upright-shad-9858-us1-kafka.upstash.io:9092"],
	sasl: {
		mechanism: "scram-sha-256",
		username: "dXByaWdodC1zaGFkLTk4NTgkgKQrp3Gg8rg1l6rbQGcmy8dh9JVo7gxX8S5P9rw",
		password: "NjU5ZTkyNjctMzVmZC00Y2M4LTg1ZGUtYmY2NzIwOGZkNmI5",
	},
	ssl: true,
})

const consumer = kafka.consumer({ groupId: "players-state" })
const producer = kafka.producer()

const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({ topic: "players-state", fromBeginning: true })
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			// Broadcast the state change to all connected clients
			// console.log("message received::", message.value.toString())
			// io.emit("updated-state-change", message.value.toString())
			const updatedPlayerState = JSON.parse(message.value)
			console.log({ updatedPlayerState })
			io.emit("player-state-change", updatedPlayerState)
		},
	})
}

const produce = async message => {
	await producer.connect()
	await producer.send({
		topic: "players-state",
		messages: [{ value: JSON.stringify(message) }],
	})
	console.log("message sent", { message })
}

module.exports = { kafka, consume, produce }
