import { _decorator, Component, director, Label, Node, ProgressBar, SceneAsset, setDisplayStats } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  @property(Node)
  Instructions: Node = null;

  @property(Node)
  loadingNode: Node = null!;

  @property(Node)
  progressBar: Node = null!;

  @property(Node)
  mainMenuButtons: Node[] = [];

  finalPercent: number = 0;
  onLoad() {
    director.preloadScene("GamePlay");
  }
  protected start(): void {
    setDisplayStats(false);
    director.preloadScene(
      "GamePlay",
      (completedCount: number, totalCount: number, item: any) => {
        var percent = 0;
        if (totalCount > 0) {
          percent = (100 * completedCount) / totalCount;
        }
        var pct = Math.max(percent, this.finalPercent);
        if (percent > this.finalPercent) {
          this.finalPercent = percent;
        }
        this.progressBar.getComponent(ProgressBar).progress = pct / 100;
        this.loadingNode.getComponent(Label).string = "Loading " + Math.round(pct) + "%";
      },
      (error: Error, asset: SceneAsset) => {
        this.mainMenuButtons[0].active = true;
        this.mainMenuButtons[1].active = true;
        this.progressBar.parent.active = false;
      }
    );
  }

  play() {
    director.loadScene("GamePlay");
  }
  help() {
    this.Instructions.active = true;
  }
  close() {
    this.Instructions.active = false;
  }
}
