"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
const MyPlayerState_1 = require("./schema/MyPlayerState");
const MyRoomState_1 = require("./schema/MyRoomState");
class MyRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.fixedTimeStep = 1000 / 60;
    }
    fixedUpdate(dt) {
        const velocity = 2;
        this.state.players.forEach((player) => {
            let input;
            // dequeue player inputs
            while ((input = player.inputQueue.shift())) {
                if (input.left) {
                    player.x -= velocity;
                }
                else if (input.right) {
                    player.x += velocity;
                }
                if (input.up) {
                    player.y -= velocity;
                }
                else if (input.down) {
                    player.y += velocity;
                }
            }
        });
    }
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;
            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedUpdate(deltaTime);
            }
        });
        this.onMessage("type", (client, message) => {
            //
            // handle "type" message
            //
        });
        this.onMessage(0, (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.inputQueue.push(data);
            }
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const mapWidth = 800;
        const mapHeight = 600;
        const player = new MyPlayerState_1.Player();
        player.x = Math.random() * mapWidth;
        player.y = Math.random() * mapHeight;
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MyRoom = MyRoom;
