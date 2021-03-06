/**
 * Responsible for all gameObject creation and creation request scripts
 * for the client (atoms, compounds, players)
 */
import * as PIXI from 'pixi.js'
import { GLOBAL } from '../global.js'
import { GameObject } from './gameobject.js'
import { player, spritesheet } from '../pixigame.js'
import { socket, objects } from '../socket.js'
import { updateCompoundButtons } from '../app.js'
import { MAP_LAYOUT, TILE_NAMES } from './tiles.js'
import { MapTile } from './maptile.js'

/**
 * Renders a new atom.
 * @param {*} data The server object reference to spawn on the clientside. Must contain:
 *  - typeID {string} See GLOBAL.ATOM_IDS
 *  - id {number} Unique ID
 *  - posX {number}
 *  - posY {number}
 *  - vx {number}
 *  - vy {number}
 */
export function createRenderAtom (data) {
	let texture = spritesheet.textures[GLOBAL.ATOM_SPRITES[GLOBAL.ATOM_IDS.indexOf(data.typeID)]]

	if (data.typeID === '') {
		throw new Error('The Atom object cannot be created without specifying behavior.')
	}

	if (texture === undefined) {
		throw new Error('Atom of type ' + data.typeID + ' could not be found!')
	}

	let result = new GameObject(texture, data.id, data.posX, data.posY, data.vx, data.vy)
	result.typeID = data.typeID
	result.height = GLOBAL.ATOM_RADIUS * 2
	result.width = GLOBAL.ATOM_RADIUS * 2

	return result
}

/**
 * Recreates an already spawned compound on the clientside based on server data.
 * @param {*} data Data sent from server:
 *  - id {number} Unique ID
 *  - posX {number}
 *  - posY {number}
 *  - vx {number}
 *  - vy {number}
 *  - blueprint {*}
 *  - sendingTeam {string}
 *  - sender {number - socket ID}
 */
export function createRenderCompound (data) {
	let texture = spritesheet.textures[data.blueprint.texture]
	let result = new GameObject(texture, data.id, data.posX, data.posY, data.vx, data.vy)

	// Make transparent if acid
	if (data.blueprint.type === 'acid') {
		result.filters = [new PIXI.filters.AlphaFilter(0.8)]
	}

	result.blueprint = data.blueprint
	result.sendingTeam = data.sendingTeam
	result.sender = data.sender

	// Parse params
	for (let param in data.blueprint.params) {
		result[param] = data.blueprint.params[param]
	}

	// Use params
	result.width = result.size
	result.height = result.size

	return result
}

/**
 * Creates a Compound by sending a request to the server.
 * @param {*} blueprint Then blueprint to create the compound from
 * @param {number} xIn x-coords
 * @param {number} yIn y-coords
 * @param {number} streamID The current stream number.
 * @returns true if successful, false if the compound was not requested.
 */
export function requestCreateCompound (blueprint, xIn, yIn, streamID) {
	updateCompoundButtons()

	let centerX = window.innerWidth / 2
	let centerY = window.innerHeight / 2
	// console.log(centerX - cursor.x, cursor.y - centerY)
	socket.emit('requestCreateCompound', {
		blueprint: blueprint,
		sendingTeam: player.team,
		sender: socket.id,
		mousePos: {
			x: xIn - centerX,
			y: centerY - yIn
		},
		streamID: streamID
	})
}

export function createTiles() {
	for (let row = 0; row < MAP_LAYOUT.length; row++) {
		for (let col = 0; col < MAP_LAYOUT[0].length; col++) {
			let tileName = 'tile_' + col + '_' + (MAP_LAYOUT.length - row - 1)
			if (objects.tiles[tileName] === undefined || objects.tiles[tileName] === null) {
				if (TILE_NAMES[MAP_LAYOUT[row][col]] !== undefined) {
					objects.tiles[tileName] = new MapTile(TILE_NAMES[MAP_LAYOUT[row][col]], col, MAP_LAYOUT.length - row - 1)
				}
				else {
					throw new Error('Tile ' + MAP_LAYOUT[row][col] + ' could not be resolved to a name.')
				}
			}
		}
	}
}
