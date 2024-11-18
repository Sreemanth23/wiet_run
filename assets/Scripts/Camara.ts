import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Camara")
export class Camara extends Component {
  @property(Node)
  Player_Node: Node = null;

  @property(Node)
  ground: Node = null;

  @property(Node)
  topBar: Node = null;

  gameOver: boolean = false;

  update(deltaTime: number) {
    if (!this.gameOver && this.Player_Node.position.x >= 0 && this.Player_Node.position.x <= 18240) {
      let targetPosition = this.Player_Node.getPosition();
      targetPosition.y = Math.min(Math.max(targetPosition.y, 0), 220);
      let currentPosition = this.node.getPosition();
      if (targetPosition.x > currentPosition.x) {
        currentPosition.lerp(targetPosition, 0.1);
      } else {
        currentPosition.lerp(new Vec3(Math.max(targetPosition.x, currentPosition.x), currentPosition.y, 0), 0.1);
      }
      this.node.setPosition(currentPosition);
      this.topBar.setPosition(currentPosition);
    }
  }
}
