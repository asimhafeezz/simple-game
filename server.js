const express = require("express")
const path = require("path")
const { produce, consume } = require("./kafka")
// const { nanoid } = require("nanoid")

const { app, server, io } = require("./config")
const { updatePlayer, addPlayer, players, emptyPlayers } = require("./players")

// Serve static files
app.use(express.static(path.join(__dirname, "public")))

// Set view engine
app.set("view engine", "ejs")

// Render index page
app.get("/", (req, res) => {
	res.render("index", { players })
})

// Socket.io connection
io.on("connection", socket => {
	console.log("A user connected")

	socket.emit("show-all-players", { players })
	// on join add a new user with id, name and y position
	socket.on("join", () => {
		// only two players allowed
		if (players.length >= 2) {
			socket.emit("error", "Playing Room is full!")
			return
		}
		addPlayer()
	})

	// on user state change
	socket.on("player-state-change", state => {
		updatePlayer(state)
		produce(state)
	})

	socket.on("disconnect", () => {
		emptyPlayers()
		console.log("User disconnected")
	})
})

consume()

// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
