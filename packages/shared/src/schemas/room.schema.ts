import { Schema, MapSchema, type } from "@colyseus/schema";

import { PlayerSchema } from "./physics-game-object.schema";

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
}
