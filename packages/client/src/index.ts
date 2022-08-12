import Phaser from "phaser";

import { Client, Room } from "colyseus.js";

import { doCrap } from "@dercetech-mp/shared";

// import { crap } from

console.log("client code");

doCrap();

// interface InputPayload {
//   left: boolean;
//   right: boolean;
//   up: boolean;
//   down: boolean;
// }

export class GameScene extends Phaser.Scene {
  client = new Client("ws://localhost:2567");
  room: Room;

  private currentPlayer: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private remoteRef: Phaser.GameObjects.Rectangle;

  private players: Record<string, Phaser.GameObjects.Image> = {};

  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  preload() {
    this.load.image("ship_0001", "https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  async create() {
    // console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room");
      this.onJoined();
    } catch (e) {
      console.error(e);
    }
  }

  private onJoined() {
    console.log("Joined successfully!");

    this.room.state.players.onAdd = (player, sessionId) => {
      // console.log("A player has joined! Their unique session id is", sessionId);
      const entity = this.physics.add.image(player.x, player.y, "ship_0001");

      if (sessionId === this.room.sessionId) {
        // this is the current player!
        // (we are going to treat it differently during the update loop)
        this.currentPlayer = entity;

        // remoteRef is being used for debug only
        this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height);
        this.remoteRef.setStrokeStyle(1, 0xff0000);

        player.onChange = () => {
          this.remoteRef.x = player.x;
          this.remoteRef.y = player.y;
        };
      } else {
        this.players[sessionId] = entity;

        player.onChange = (changes, key) => {
          // console.log(changes[0].value, key);
          // entity.x = player.x;
          // entity.y = player.y;

          entity.setData("serverX", player.x);
          entity.setData("serverY", player.y);
        };
      }
    };

    this.room.state.players.onRemove = (player, sessionId) => {
      const entity = this.players[sessionId];

      if (entity) {
        delete this.players[sessionId];
        entity.destroy();
      }
    };
  }

  private fixedTick() {
    // Linear interpolation of player positions
    Object.keys(this.players)
      .filter((playerSessionId) => playerSessionId !== this.room.sessionId)
      .map((playerSessionId) => this.players[playerSessionId])
      .forEach((entity) => {
        const { serverX, serverY } = entity.data.values;

        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      });

    // Send update to server

    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;

    // Position prediction

    if (this.currentPlayer) {
      const velocity = 2;

      if (this.inputPayload.left) {
        this.currentPlayer.x -= velocity;
      }

      if (this.inputPayload.right) {
        this.currentPlayer.x += velocity;
      }

      if (this.inputPayload.up) {
        this.currentPlayer.y -= velocity;
      }

      if (this.inputPayload.down) {
        this.currentPlayer.y += velocity;
      }
    }

    this.room.send(0, this.inputPayload);
  }

  update(time: number, delta: number): void {
    // skip loop if not connected with room yet.
    if (!this.room) {
      return;
    }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick();
    }
  }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#b6d53c",
  parent: "phaser-example",
  physics: { default: "arcade" },
  pixelArt: true,
  scene: [GameScene],
};

// instantiate the game
const game = new Phaser.Game(config);
