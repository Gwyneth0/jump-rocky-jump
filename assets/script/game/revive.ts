import { _decorator, Component, SpriteComponent, Node, WidgetComponent, Label } from "cc";
import { Constants } from "../data/constants";
import { PageResult } from "./pageResult";
const { ccclass, property } = _decorator;

@ccclass("Revive")
export class Revive extends Component {

    private _closeCb: Function = null;
    public get closeCb(): Function {
        return this._closeCb;
    }
    public set closeCb(value: Function) {
        this._closeCb = value;
    }
    @property(WidgetComponent)
    private _wgMenu: WidgetComponent = null;
    public get wgMenu(): WidgetComponent {
        return this._wgMenu;
    }
    public set wgMenu(value: WidgetComponent) {
        this._wgMenu = value;
    }
    @property(Label)
    private historyLabel: Label = null;
    @property({ type: Label })
    private scoreLabel: Label = null;
    @property({ type: Label })
    private progressLabel: Label = null;
    @property(SpriteComponent)
    private spCountDown: SpriteComponent = null;
    private _pageResult: PageResult = null;
    public get pageResult(): PageResult {
        return this._pageResult;
    }
    public set pageResult(value: PageResult) {
        this._pageResult = value;
    }
    private countDownTime: number;
    private currentTime: number;
    private isCountDowning: boolean;

    protected onEnable(): void {
        this.show();
    }

    protected show(): void {
        const score = Constants.game.score;
        this.scoreLabel.string = score.toString();
        if (Constants.MAX_SCORE < score) {
            Constants.MAX_SCORE = score;
        }
        this.historyLabel.string = Constants.MAX_SCORE.toString();
        this.countDownTime = 5;
        this.progressLabel.string = this.countDownTime + '';
        this.currentTime = 0;
        this.spCountDown.fillRange = 1;
        this.isCountDowning = true;
    }

    protected onBtnReviveClick(): void {
        this.isCountDowning = false;
        Constants.game.audioManager.playClip();
        Constants.game.node.emit(Constants.GAME_EVENT.REVIVE);
        this.pageResult.showResult(false);
    }

    protected onBtnSkipClick(): void {
        Constants.game.audioManager.playClip();
        this.isCountDowning = false;

        Constants.game.gameOver();
    }

    protected update(dt: number): void {
        if (!this.isCountDowning) {
            return;
        }
        this.currentTime += dt;
        let spare = this.countDownTime - this.currentTime;
        this.progressLabel.string = Math.ceil(spare) + '';
        if (spare <= 0) {
            spare = 0;
            this.isCountDowning = false;
            this.onBtnSkipClick();
        }
        let percent = spare / this.countDownTime;
        this.spCountDown.fillRange = percent;
    }

}
