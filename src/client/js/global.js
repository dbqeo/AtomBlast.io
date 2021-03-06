import { MAP_LAYOUT } from './obj/tiles'

// Contains all global constants and functions for both the client and server.
export const GLOBAL = {

	DEBUG: true, // REMEMBER to toggle this lmao if you dont want your entire pc crashing
	VERBOSE_SOCKET: false, // true = debug clientside socket -> log if any socket method has been called
	// Keys and other mathematical constants
	KEY_ESC: 27,
	KEY_ENTER: 13,
	KEY_W: 87,
	KEY_A: 65,
	KEY_S: 83,
	KEY_D: 68,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_SPACE: 32,

	// Blueprints
	BP_SELECT: 'Blueprint Select - Slot ', // Text for blueprint select header
	BP_MAX: 4, // Maximum number of blueprints a player can have in one game at a time
	// Params that will not display on tooltip
	BP_TOOLTIP_BLACKLIST: [
		'evaporate',
		'splashImage'
	],

	// Main menu
	INPUT_COUNT: 3, // Number of input boxes on main menu

	// Chat
	PLACEHOLDER_NAME: 'Unnamed Player',
	MAX_CHATS: 50, // Max number of chats to be displayed before deleting

	// Server
	SERVER_IP: 'atomblast.bananiumlabs.com:12002', // Change during production!!!!!
	LOCAL_HOST: 'localhost:12002',
	TEST_IP: 'https://iogame-test.herokuapp.com/',
	NO_ROOM_IDENTIFIER: '$_NOROOM', // Pass to server if matchmaking is required
	NO_TEAM_IDENTIFIER: '$_NOTEAM', // Pass to server if matchmaking is required
	ROOM_DELETE_DELAY: 30000, // Time, in ms, between winning and room closing

	// Cookies
	COOKIES: [
		'name', // 0
		'room', // 1
		'team', // 2
		'bp-slot-1', // 3
		'bp-slot-2', // 4
		'bp-slot-3', // 5
		'bp-slot-4', // 6
		'room-type', // 7
		'server' // 8
	],
	COOKIE_DAYS: 14, // Cookie lifetime

	// Player Movement
	MAX_SPEED: 6,
	PLAYER_RADIUS: 100,
	VELOCITY_STEP: 0.85, // speed multiplier when player is gliding to a stop
	LERP_VALUE: 0.2,
	DEADZONE: 0.1,
	MAX_HEALTH: 100, // Starting health of players
	PLAYER_ROTATION: 0.05,
	PLAYER_EXPEDITED_ROTATION: 0.1,

	// Atoms
	ATOM_RADIUS: 30, // size of spawned atoms
	MIN_POWERUPS: 150, // minimum number of powerups to be spawned (TEMPORARY)
	MAX_POWERUPS: 300, // maximum number of powerups to be spawned (TEMPORARY)
	ATTRACTION_RADIUS: 150, // Max distance for powerup to be attracted to player
	ATTRACTION_COEFFICIENT: 100, // Multiplier for attraction strength
	ATOM_SPAWN_SPEED: 15, // Speed that atom travels away from spawner
	ATOM_SPAWN_DELAY: 3000, // Atom spawn delay, in milliseconds
	ATOM_COLLECT_THRESHOLD: 100, // Distance away from center of player that the atom must be before being collected

	// Map and Tiles
	MAP_SIZE: 2000,
	SPAWN_POINTS: [
		{ x: 0, y: 0 },
		{ x: 6, y: 6 },
		{ x: 0, y: 6 },
		{ x: 6, y: 0 }
	], // Spawn points for different teams
	MAX_SPAWNER_HEALTH: 100,
	MAX_STRONGHOLD_HEALTH: 200,
	MAX_NUCLEUS_HEALTH: 300,
	STRONGHOLD_RADIUS: 100,
	STRONGHOLD_DEFENSE: 5,

	// Drawing
	DRAW_RADIUS: 1000, // Radius around player in which to draw other objects
	GRID_SPACING: 200, // space between each line on the grid
	GRID_LINE_STROKE: 1,
	FRAME_RATE: 60,

	// Colors
	TEAM_COLORS: [ // Purple, Green, Orange, Red. No prefixes
		'673ab7',
		'2e7d32',
		'ff8f00',
		'f44336'
	],

	IGNITE_SPRITE: 'placeholder_ignited.png',

	// Atoms: ID's and Sprites. ATOM_SPRITES[id] returns the texture location of atom of that id.
	ATOM_IDS: [
		'h',
		'he',
		'c',
		'cl',
		'n',
		'o'
	],
	ATOM_SPRITES: [
		'atom_hydrogen.png',
		'atom_helium.png',
		'atom_carbon.png',
		'testplayer2.png',
		'atom_nitrogen.png',
		'atom_oxygen.png'
	],

	// Location of spritesheet relative to pixigame
	SPRITESHEET_DIR: '../assets/spritesheet.json',

	// Used for main menu textures
	COMPOUND_DIR: '../assets/spritesheet/compounds/',

	// Each Value corresponds with the above event
	EXPERIENCE_VALUES: {
		CRAFT: 10,
		KILL: 124
	},

	// The cutoffs for each level. Index 0 = level 1, 1 = level 2, etc
	EXPERIENCE_LEVELS: [
		0,
		10,
		20,
		40,
		100,
		140,
		160
	],
	MAINMENU_MUSICLIST: [
		'assets/sfx/mainmenu/placeholder1.mp3',
		'assets/sfx/mainmenu/placeholder2.mp3',
		'assets/sfx/mainmenu/placeholder3.mp3'
		// 'assets/sfx/mainmenu/placeholder4.mp3'
	],
	LOBBY_MUSICLIST: [

	],
	INGAME_MUSICLIST: [

	],

	// Deaths
	KILL_SCORE: 6, // How many points are awarded to the player/team who dealt the most damage to the player
	ASSIST_SCORE: 2, // How many points are awarded to all players who assist in killing the player
	WINNING_SCORE: 20, // How many points are required to win the game per team. TODO increase
	CAPTURE_SCORE: 5, // How many points are awarded to the team who captured a stronghold/vent
	MAX_DEATH_ATOMS: 100 // How many atoms of each type can be ejected on death at maximum. Prevents testers from ejecting thousands of atoms at a time.
}

/**
 * Returns the distance between two objects.
 * Both objects must be GameObjects
 * @param {GameObject} obj1 First object
 * @param {GameObject} obj2 Second object
 */
export function distanceBetween (obj1, obj2) {
	return Math.sqrt(Math.pow(obj1.posX - obj2.posX, 2) + Math.pow(obj1.posY - obj2.posY, 2))
}

/**
 * Returns true if the object parameter is within the map boundaries.
 * @param {GameObject} obj The object to test
 * @return true if the object parameter is within the map boundaries
 */
export function isInBounds (obj) {
	return obj.posX > 0 && obj.posY > -GLOBAL.GRID_SPACING * 2 && obj.posX < MAP_LAYOUT[0].length * GLOBAL.GRID_SPACING * 2 && obj.posY < (MAP_LAYOUT.length - 1) * GLOBAL.GRID_SPACING * 2
}

/**
 * Gets the tile directly underneath any object.
 * @param {*} obj Any valid GameObject.
 * @returns {string} one-letter ID of current tile.
 */
export function getCurrTile (obj) {
	let pos = getGlobalLocation(obj)

	try {
		return MAP_LAYOUT[pos.globalY][pos.globalX]
	}
	catch (error) {
		return 'E'
	}
}

/**
 * Gets the coordinates of the tile directly underneath the object.
 * @param {*} obj Any valid GameObject.
 */
export function getGlobalLocation (obj) {
	return {
		globalY: Math.floor(obj.posY / (GLOBAL.GRID_SPACING * 2)) + 1,
		globalX: Math.floor(obj.posX / (GLOBAL.GRID_SPACING * 2))
	}
}

/**
* Returns a random number between between 10000000 and 99999999, inclusive.
* TODO Make every ID guaranteed unique
* @returns random id between 10000000 and 99999999
*/
export function generateID() {
	return Math.floor(Math.random() * 90000000) + 10000000
}
