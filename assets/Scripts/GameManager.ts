import { _decorator, Component, director, error, Label, Node, PhysicsSystem2D, Prefab, Vec3 } from "cc";
import { ObjectPool } from "./ObjectPool";
import { Camara } from "./Camara";
import { AudioManager } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(AudioManager)
  audioManager: AudioManager = null;

  @property(Prefab)
  base: Prefab = null;

  @property(ObjectPool)
  objectPool: ObjectPool = null;

  @property(Prefab)
  groundObjects: Prefab[] = [];

  @property(Prefab)
  trees: Prefab[] = [];

  @property(Label)
  scores: Label = null;

  @property(Node)
  camera: Node = null;

  @property(Node)
  gameOverScreen: Node = null;

  @property(Node)
  nextLevelScreen: Node = null;

  @property(Node)
  player_Node: Node = null;

  platformCount = 0;
  count = 0;
  coinCount = 0;
  activeBG = false;

  protected onLoad(): void {
    try {
      PhysicsSystem2D.instance.enable = true;
      director.preloadScene("GamePlay");
      director.preloadScene("MainMenu");
      this.objectPool.prefabObjects = [this.base, this.groundObjects[0], this.groundObjects[1], this.groundObjects[2], this.groundObjects[3], this.trees[0], this.trees[1], this.trees[2]];
      this.objectPool.initPool(); // Call initPool to set up the pools
      for (let i = 0; i < 3; i++) {
        this.generateBg();
      }
    } catch {
      console.log("Error OnLoading", error);
    }
  }

  generateBg() {
    let basePosition: Vec3 = new Vec3(this.platformCount * 1917, 0);
    this.createObject(this.base, this.node, basePosition);
    if (this.count >= 3) {
      this.count = 2;
    }
    this.generateTrees(this.node.children[this.count].children[1].getChildByName("ObjectsPlacement"));
    this.generateObjects(this.node.children[this.count].children[1].getChildByName("ObjectsPlacement"));
    if (this.platformCount <= 3) {
      this.count++;
    }
    this.platformCount++;
  }

  createObject(prefab: Prefab, parent: Node, position: Vec3) {
    this.objectPool.addPool(prefab, parent, position);
  }

  resetGame() {
    this.objectPool.reset();
  }

  generateBaseFromPool() {
    this.node.children[0].children[1].getChildByName("ObjectsPlacement").destroyAllChildren();
    this.objectPool.returnToPool(this.node.children[0]);
    this.generateBg();
    this.activeBG = false;
  }

  generateTrees(bg: Node) {
    const randomTree = this.trees[Math.floor(Math.random() * this.trees.length)];
    this.createObject(randomTree, bg, new Vec3(0, 0, 0));
  }

  generateObjects(bg: Node) {
    const objectMappings = {
      0: [
        { object: this.groundObjects[1], position: new Vec3(0, -80.66, 0) },
        { object: this.groundObjects[2], position: new Vec3(0, -106.406, 0) },
      ],
      1: [
        { object: this.groundObjects[0], position: new Vec3(0, -129.224, 0) },
        { object: this.groundObjects[2], position: new Vec3(0, -106.406, 0) },
      ],
      2: [
        { object: this.groundObjects[3], position: new Vec3(0, -143.582, 0) },
        { object: this.groundObjects[1], position: new Vec3(0, -80.66, 0) },
      ],
    };
    const randomNumber = Math.floor(Math.random() * 3);
    objectMappings[randomNumber].forEach((mapping) => {
      this.createObject(mapping.object, bg, mapping.position);
    });
  }

  gameOver() {
    this.audioManager.playAudio(3);
    this.camera.getComponent(Camara).gameOver = true;
    this.camera.setPosition(0, 0, 0);
    this.gameOverScreen.active = true;
    this.gameOverScreen.children[3].getComponent(Label).string = `SCORE : ${this.coinCount.toString()}`;
  }

  update(deltaTime: number) {
    try {
      this.scores.string = this.coinCount.toString();
      if (this.activeBG) {
        this.generateBaseFromPool();
      }
      if (this.player_Node.position.x >= 19000) {
        this.audioManager.playAudio(6);
        this.nextRound();
      }
    } catch (error) {
      console.error("Error during update in GM:", error);
    }
  }

  nextRound() {
    this.nextLevelScreen.active = true;
    this.camera.getComponent(Camara).gameOver = true;
    this.camera.setPosition(0, 0, 0);
  }

  restart() {
    this.audioManager.playAudio(1);
    director.loadScene("GamePlay");
  }

  home() {
    this.audioManager.playAudio(1);
    director.loadScene("MainMenu");
  }
}
