import { _decorator, Component, ProgressBar, Label, director, Node, SceneAsset, sys, game, macro, setDisplayStats } from "cc";
const { ccclass, property } = _decorator;

@ccclass("loadingScript")
export class loadingScript extends Component {
  @property({ type: Node })
  loadingNode: Node = null!;

  @property({ type: Node })
  progressBar: Node = null!;

  sceneName: string = "MainScene";
  finalPercent: number = 0;

  onLoad() {
    setDisplayStats(false);

    if (sys.capabilities.opengl) {
      // Enable WebGL rendering
      game.renderType = 1;

      // Optional: Set other WebGL-related configurations
      macro.ENABLE_WEBGL_ANTIALIAS = true;

      // Other initialization logic for your game...
    } else {
      // WebGL is not supported, handle the error gracefully
      console.error("WebGL is not supported in this browser.");
    }
  }

  start() {
    var imgElement = document.getElementById("BGImageId");
    imgElement.remove();

    // a progress of scene loading,0 ~ 1;
    director.preloadScene(
      "MainScene",
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
        console.log("Scene Loaded");
        director.loadScene(this.sceneName);
      }
    );
  }
}