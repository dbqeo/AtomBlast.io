import { GLOBAL } from "./global";
import { cookieInputs, quitGame, updateLobby } from "./app";
import ChatClient from "./lib/chat-client";
import { loadTextures, app, createPlayer, isSetup, showGameUI, startGame } from "./pixigame";
import { spawnAtom } from "./obj/atom";
import { createCompound } from "./obj/compound";
import { MapTile } from "./obj/maptile";
import { MAP_LAYOUT } from "./obj/tiles";

/**
 * Socket.js contains all of the clientside networking interface.
 * It contains all variables which are synced between client and server.
 */

// Socket.io instance
export var socket;

/* Object containing all synced objects. Contains nested objects, which correspond to different types
 * (for example, objects[atoms], objects[players], objects[compounds])
 */
export var objects = {
    players: {},
    atoms: {},
    compounds: {},
    tiles: {}
};

/**
 * Attempts to connect to the server.
 */
export function beginConnection() {
    //Joins debug server if conditions are met
    let room = (cookieInputs[7].value === 'private' ? cookieInputs[1].value : GLOBAL.NO_ROOM_IDENTIFIER);
    if (cookieInputs[1].value === 'jurassicexp') {
        console.log('Dev Backdoor Initiated! Connecting to devserver');
        //Debugging and Local serving
        socket = io.connect(GLOBAL.LOCAL_HOST, {
            query: `room=${room}&name=${cookieInputs[0].value}&team=${cookieInputs[2].value}&roomType=${cookieInputs[7].value}`,
            reconnectionAttempts: 3
        });
    }
    else {
        // Production server
        console.log('connecting to main server');
        socket = io.connect(GLOBAL.SERVER_IP, {
            query: `room=${room}&name=${cookieInputs[0].value}&team=${cookieInputs[2].value}&roomType=${cookieInputs[7].value}`,
            reconnectionAttempts: 3
        });
    }

    socket.on('connect', () => {
        setupSocket();
        // Init pixi
        loadTextures()
        if (typeof app !== undefined) {
            app.start();
        }
    });
}

/**
 * Run on disconnect to reset all server-based variables and connections
 */
export function disconnect() {
    app.stop();
    socket.disconnect();

    // Wipe objects list
    for(let objType in objects)
        objects[objType] = {};
}

/** 
 * First time setup when connection starts. Run on connect event to ensure that the socket is connected first.
 */
function setupSocket() {


    //Debug
    console.log('Socket:', socket);

    //Instantiate Chat System
    let chat = new ChatClient({ player: cookieInputs[0].value, room: cookieInputs[1].value, team: cookieInputs[2].value });
    chat.addLoginMessage(cookieInputs[0].value, true);
    chat.registerFunctions();


    // On Connection Failure
    socket.on('reconnect_failed', () => {
        alert("You have lost connection to the server!");
    });

    socket.on('reconnecting', (attempt) => {
        console.log("Lost connection. Reconnecting on attempt: " + attempt);
        quitGame('Lost connection to server');
    });

    socket.on('reconnect_error', (err) => {
        console.log("CRITICAL: Reconnect failed! " + err);
    });

    socket.on('pong', (ping) => {
        console.log("Your Ping Is: " + ping);
    });

    // Syncs all objects from server once a frame
    socket.on('objectSync', (data) => {
        for(let objType in data) {
            if(objType !== 'tiles') {
                for (let obj in data[objType]) {
                    if (data[objType][obj] !== null) {
                        let objRef = data[objType][obj];
                        let clientObj = objects[objType][obj];
                        // Already exists in database
                        if (clientObj !== undefined && clientObj !== null) {
                            if (objRef.id !== socket.id)
                                objects[objType][obj].setData(objRef.posX, objRef.posY, objRef.vx, objRef.vy);
                            if (objType === 'players')
                                objects[objType][obj].health = objRef.health;
                        }
                        // Does not exist - need to clone to clientside
                        else if (isSetup) {
                            switch (objType) {
                                case 'players':
                                    objects[objType][obj] = createPlayer(objRef);
                                    break;
                                case 'atoms':
                                    objects[objType][obj] = spawnAtom(objRef.typeID, objRef.id, objRef.posX, objRef.posY, objRef.vx, objRef.vy);
                                    break;
                                case 'compounds':
                                    objects[objType][obj] = createCompound(objRef);
                                    break;
                            }
                        }
                    }
                }
            }
            // else { //Tile drawing
            //     for (let tile of data.tiles) {

            //         let tileName = 'tile_' + tile.col + '_' + tile.row;
            //         if (objects.tiles[tileName] === undefined) {
            //             // console.log(tileName);
            //             objects.tiles[tileName] = new MapTile(MAP_LAYOUT[tile.row][tile.col], tile.col, tile.row);
            //         }

            //     }
            // }

        }
    });

 
      

    // Sync atoms that have not been picked up
    socket.on('serverSendAtomRemoval', (data) => {
        //An Atom was removed
        if (objects.atoms[data.id] !== undefined) {
            objects.atoms[data.id].hide();
            delete objects.atoms[data.id];
        }
    });

    // Compound has collided
    socket.on('serverSendCompoundRemoval', (data) => {
        //An Atom was removed
        console.log('Server send compound removal');
        if (objects.compounds[data.id] !== undefined) {
            objects.compounds[data.id].hide();
            delete objects.compounds[data.id];
        }
    });

    socket.on('disconnectedPlayer', (data) => {
        console.log('Player ' + data.id + ' has disconnected');
        chat.addSystemLine('Player ' + objects.players[data.id].name + ' has disconnected');
        if (objects.players[data.id] !== undefined) {
            objects.players[data.id].hide();
            delete objects.players[data.id];
        }
    });

    //Chat system receiver
    socket.on('serverMSG', data => {
        chat.addSystemLine(data);
    });

    socket.on('serverSendPlayerChat', data => {
        chat.addChatLine(data.sender, data.message, false);
    });

    socket.on('serverSendLoginMessage', data => {
        chat.addLoginMessage(data.sender, false);
    });

    // Errors on join
    socket.on('connectionError', (data) => {
        socket.disconnect();
        quitGame(data.msg, true);
    })

    // Receive information about room players
    socket.on('roomInfo', (data) => {
        // Update lobby info. Pass to app.js
        updateLobby(data);

        // if(GLOBAL.DEBUG) {
        //     console.log("rcvd: ",data);
        // }
    })

    socket.on('serverSendStartGame', (data) => {
        console.log('game has started');
        startGame(false);
    });

    socket.on('levelUp', (data) => {
        console.log('You LEVELED UP! Level: ' + data.newLevel)
    });

    //Emit join message,
    socket.emit('playerJoin', { sender: chat.player, team: chat.team });
}

// Linear Interpolation function. Adapted from p5.lerp
function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}