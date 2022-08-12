import { Room, Client } from "colyseus";
import { Player } from "./schema/MyPlayerState";

import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  fixedTimeStep = 1000 / 60;

  private fixedUpdate(dt: number) {
    const velocity = 2;

    this.state.players.forEach((player) => {
      let input: any;

      // dequeue player inputs
      while ((input = player.inputQueue.shift())) {
        if (input.left) {
          player.x -= velocity;
        } else if (input.right) {
          player.x += velocity;
        }

        if (input.up) {
          player.y -= velocity;
        } else if (input.down) {
          player.y += velocity;
        }
      }
    });
  }

  onCreate(options: any) {
    this.setState(new MyRoomState());
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

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const mapWidth = 800;
    const mapHeight = 600;

    const player: Player = new Player();
    player.x = Math.random() * mapWidth;
    player.y = Math.random() * mapHeight;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
