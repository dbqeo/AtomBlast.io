import * as PIXI from 'pixi.js';
import { Player } from './player.js';
import { GLOBAL } from '../global.js';
import { GameObject } from '../obj/gameobject';
import { distanceBetween } from '../global.js';
import { screenCenterX, screenCenterY, player } from '../pixigame.js';
import { socket } from '../app.js';

/**
 * An Atom can be picked up by players and used to create Compounds.
 */
export class Atom extends GameObject {

    /**
     * Creates a atom at the given coordinates. If no coordinates are given, then 
     * the atom spawns in a random location.
     * @param {number} id The ID of this atom (generated by server)
     * @param {number} typeID The numerical type of this atom (see spawnAtom or global for details)
     * @param {string} texture The Pixi texture corresponding to this Atom
     * @param {number} x (optional) X Coordinate of the atom 
     * @param {number} y (optional) Y Coordinate of the atom 
     * @param {number} vx Horizontal velocity
     * @param {number} vy Vertical velocity
     */
    constructor(id, typeID, texture, x, y, vx, vy) {
        // Atoms have a random ID between 100000 and 999999, inclusive.
        super(texture, id, x, y, vx, vy);
        this.height = GLOBAL.ATOM_RADIUS * 2;
        this.width = GLOBAL.ATOM_RADIUS * 2;
        this.isEquipped = false;
        this.typeID = -1;
    }

    /**
     * Run when players are nearby to check if they picked this atom up.
     * If the player is nearby but not close enough to pick up, then it becomes attracted towards the player.
     * @param {Player} player Player to check collision against
     * @returns true if collision detected, false otherwise
     */
    checkCollision(player) {
        if (this.isEquipped || player === undefined)
            return false;
        
        let distance = distanceBetween(this, player);

        // Attractive force
        if(distance < GLOBAL.ATTRACTION_RADIUS) {
            // let theta = Math.tan((this.posY - player.posY)/());
            this.vx += 1/(player.posX - this.posX) * GLOBAL.ATTRACTION_COEFFICIENT;
            this.vy += 1/(player.posY - this.posY) * GLOBAL.ATTRACTION_COEFFICIENT;
            // console.log(this.vx, this.vy, this.posX, this.posY);
            socket.emit('atomMove', {id: this.id, posX: this.posX, posY: this.posY, vx: this.vx, vy: this.vy});
        }
        else if(this.vx !== 0 || this.vy !== 0) {
            this.vx *= GLOBAL.VELOCITY_STEP;
            this.vy *= GLOBAL.VELOCITY_STEP;
        }

        // Collected by player
        if (distance < GLOBAL.ATOM_RADIUS + GLOBAL.PLAYER_RADIUS) {
            this.isEquipped = true;
            player.addAtom(this.typeID);
            socket.emit('atomCollision', {id: this.id});
            return true;
        }

        return false;
    }

    tick() {

        // Movement
        super.tick();

        if (!this.isEquipped) {
            this.checkCollision(player);
            this.draw();
        }
        else
            this.hide();
    }

}

/**
 * Returns a new atom object of the given type.
 * @param {number} typeID ID of the atom to be created. ID reference can be found in GLOBAL.
 * @param {number} id The ID of this atom (generated by server)
 * @param {number} x (optional) x-coordinate of the atom
 * @param {number} y (optional) y-coordinate of the atom
 * @param {number} vx Horizontal velocity
 * @param {number} vy Vertical velocity
 */
export function spawnAtom(typeID, id, x, y, vx, vy) {

    let rs = PIXI.loader.resources;
    let as = GLOBAL.ATOM_SPRITES;
    let texture = undefined;

    switch (typeID) {
         case GLOBAL.HYDROGEN_ATOM: 
             texture = rs[as[GLOBAL.HYDROGEN_ATOM]].texture;
             break;
        // Tried to create a generic atom
        case -1:
            throw new Error('The Atom object cannot be created without specifying behavior.');
            break;
    }

    if(texture === undefined)
        throw new Error('Atom of type ' + typeID + ' could not be found!');

    return new Atom(id, typeID, texture, x, y, vx, vy);
} 