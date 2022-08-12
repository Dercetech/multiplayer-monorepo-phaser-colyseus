import { Schema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") angle: number;
  @type("number") velocityX: number;
  @type("number") velocityY: number;

  inputQueue: any[] = [];
}
