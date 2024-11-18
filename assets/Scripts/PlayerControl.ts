import { _decorator, Component, input, Input, KeyCode, Node, RigidBody2D, Animation, v2, Vec2, Button, sys } from "cc";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerControl")
export class PlayerControl extends Component {
  @property(AudioManager)
  audioManager: AudioManager = null;

  @property(Button)
  directionButton: Node[] = [];

  rigidBody: RigidBody2D = null;
  direction = 0;
  onTheGround = false;
  velocityX = 20;
  walkForce = 150;
  jumpForce = 12000;

  onLoad() {
    if (sys.isMobile) {
      this.directionButton.forEach((button) => {
        button.active = true;
      });
      console.log("Mobile");
    } else {
      this.directionButton.forEach((button) => {
        button.active = false;
      });
      console.log("other Device");
    }
    this.rigidBody = this.node.getComponent(RigidBody2D);
    input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
    input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);
    this.directionButton.forEach((button) => {
      button.on(Input.EventType.TOUCH_START, this.onKeyPressed, this);
      button.on(Input.EventType.TOUCH_END, this.onKeyReleased, this);
    });
  }

  onKeyPressed(event) {
    const target = event.target as Node;
    let key_code = event.keyCode;
    this.audioManager.playAudio(4);
    if (key_code == KeyCode.ARROW_LEFT || target?.name == "Left") {
      this.direction = -1;
    } else if (key_code == KeyCode.ARROW_RIGHT || target?.name == "Right") {
      this.direction = 1;
    }
    if (key_code == KeyCode.ARROW_UP || target?.name == "Up") {
      if (this.onTheGround) {
        this.audioManager.playAudio(4);
        this.rigidBody.applyForceToCenter(v2(0, this.jumpForce), true);
        this.onTheGround = false;
      }
    } else if (key_code == KeyCode.ARROW_DOWN || target?.name == "Down") {
      if (!this.onTheGround) {
        this.rigidBody.applyForceToCenter(Vec2.ZERO, true);
      }
    }
  }

  update(dt) {
    if ((this.direction > 0 && this.rigidBody.linearVelocity.x < this.velocityX) || (this.direction < 0 && this.rigidBody.linearVelocity.x > -this.velocityX)) {
      this.rigidBody.applyForceToCenter(v2(this.direction * this.walkForce, 0), true);
    }
    if (this.direction < 0) {
      this.node.children[0].setScale(-1, 1);
      this.node.children[0].getComponent(Animation).crossFade("run");
    }
    if (this.direction > 0) {
      this.node.children[0].setScale(1, 1);
      this.node.children[0].getComponent(Animation).crossFade("run");
    }
    if (this.direction == 0) {
      this.node.children[0].getComponent(Animation).crossFade("idealBlink");
    }
  }

  onKeyReleased(event) {
    const target = event.target as Node;
    let key_code = event.keyCode;
    this.audioManager.playAudio(4);

    if (key_code == KeyCode.ARROW_LEFT || target?.name == "Left") {
      this.direction = 0;
      this.rigidBody.applyForceToCenter(Vec2.ZERO, false);
      this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(1, 0);
    } else if (key_code == KeyCode.ARROW_RIGHT || target?.name == "Right") {
      this.direction = 0;
      this.rigidBody.applyForceToCenter(Vec2.ZERO, false);
      this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(-1, 0);
    }
  }
}
