import { _decorator, AudioClip, loader, Component, AudioSource } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
    @property(AudioClip)
    private bg: AudioClip = null!;
    @property(AudioClip)
    private click: AudioClip = null!;
    private audioComp: AudioSource = null!;

    protected start(): void {
        this.audioComp = this.getComponent(AudioSource)!;
    }

    public playSound(play = true): void {
        if (!play) {
            this.audioComp.stop();
            return;
        }
        this.audioComp.clip = this.bg;
        this.audioComp.play();
    }

    public playClip(): void {
        this.audioComp.playOneShot(this.click);
    }
}
