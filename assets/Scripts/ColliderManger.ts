import { _decorator, Collider2D, Color, Component, Contact2DType, IPhysics2DContact, Node, Sprite, UIOpacity } from "cc";
import { GameManager } from "./GameManager";
import { PlayerControl } from "./PlayerControl";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("ColliderManger")
export class ColliderManger extends Component {
  @property(GameManager)
  gameManager: GameManager = null;

  @property(AudioManager)
  audioManager: AudioManager = null;

  @property(Node)
  Health: Node = null;

  healthCount = 5;

  start() {
    let collider = this.node.getComponent(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    let other_Collider = otherCollider.node;
    switch (other_Collider.name) {
      case "coin":
        this.handleCoinCollision(other_Collider);
        break;
      case "Saw":
        this.handleSawCollision(selfCollider);
        break;
      case "Base":
        this.handleBaseCollision();
        break;
    }
  }

  handleCoinCollision(other_Collider: Node) {
    if (other_Collider.getComponent(UIOpacity).opacity == 255) {
      this.audioManager.playAudio(0);
      other_Collider.getComponent(UIOpacity).opacity = 0;
      this.gameManager.coinCount++;
    }
  }

  handleSawCollision(selfCollider: Collider2D) {
    this.audioManager.playAudio(5);
    this.Health.children[this.healthCount - 1].getComponent(Sprite).color = Color.WHITE;
    this.schedule(
      () => {
        if (this.node.getComponent(UIOpacity).opacity == 255) {
          this.node.getComponent(UIOpacity).opacity = 0;
        }
        this.scheduleOnce(() => {
          this.node.getComponent(UIOpacity).opacity = 255;
        }, 0.2);
      },
      0.5,
      2,
      0
    );
    this.healthCount--;
    if (this.healthCount == 0) {
      selfCollider.enabled = false;
      this.audioManager.playAudio(3);
      this.gameManager.gameOver();
    }
  }

  handleBaseCollision() {
    this.node.getComponent(PlayerControl).onTheGround = true;
  }
  onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    let other_Collider = otherCollider.node;
    if (other_Collider.name == "WallColliderEnd") {
      let otherCollider_parent = other_Collider.parent;
      if (otherCollider_parent.getSiblingIndex() == 1) {
        this.gameManager.activeBG = true;
      }
    }
  }
}
