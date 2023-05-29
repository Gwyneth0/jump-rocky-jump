import { _decorator, Component, Node, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UpdateValueLabel")
export class UpdateValueLabel extends Label {
    private _isPlaying = false;
    public get isPlaying() {
        return this._isPlaying;
    }
    public set isPlaying(value) {
        this._isPlaying = value;
    }
    private startVal = 0;
    private endVal = 0;
    private diffVal = 0;
    private currTime = 0;
    private changingTime = 0;

    public playUpdateValue(startVal: number, endVal: number, changingTime: number): void {
        this.startVal = startVal;
        this.endVal = endVal;
        this.diffVal = this.endVal - this.startVal;
        this.currTime = 0;
        this.changingTime = changingTime;
        this.string = startVal.toString();
        this.isPlaying = true;
    }
    protected update(dt: number): void {
        if (!this.isPlaying) {
            return;
        }
        if (this.currTime < this.changingTime) {
            this.currTime += dt;
            var currVal = this.startVal + parseInt((this.currTime / this.changingTime * this.diffVal).toString());
            if (currVal < this.startVal) {
                currVal = this.startVal;
            } else if (currVal > this.endVal) {
                currVal = this.endVal;
            }
            this.string = currVal.toString();
            return;
        }
        this.string = this.endVal.toString();
        this.isPlaying = false;
    }
}
