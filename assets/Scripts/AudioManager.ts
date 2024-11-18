import { _decorator, Component, AudioClip, AudioSource, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  @property(AudioClip)
  clips: AudioClip[] = [];

  private audioSource_: AudioSource = new AudioSource();

  /*Note
    0 - coin Sound
    1 - button click
    2 - GameOver
    3 - die
    4 - Jump
    6 -obstacle
    6 - next Level
    */

  playAudio(audioName) {
    this.audioSource_.playOneShot(this.clips[audioName], 1);
  }
}
