const { io } = require("./config")
const { produce } = require("./kafka")

let players = []

const addPlayer = () => {
	const id = players.length + 1
	const newPlayer = { id, name: "player " + id, y: 0 }
	players.push(newPlayer)

	// produce and emit the new state
	// produce(newPlayer)
	io.emit("newplayer-joined", newPlayer)
}

const updatePlayer = state => {
	// find the user in the array and update the y position
	console.log({ state })
	let newState = players.map(player => {
		if (player.id === state.id) {
			return {
				...player,
				y: state.y,
			}
		}
		return player
	})
	console.log({ newState })
	players = newState
}

const removePlayer = ({ id }) => {
	const index = players.findIndex(player => player.id === id)
	if (index !== -1) {
		return players.splice(index, 1)[0]
	}
}

const emptyPlayers = () => {
	players = []
}

const getAllPlayers = () => players

module.exports = {
	addPlayer,
	updatePlayer,
	removePlayer,
	getAllPlayers,
	players,
	emptyPlayers,
}
