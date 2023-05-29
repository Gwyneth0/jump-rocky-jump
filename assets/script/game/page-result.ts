import { _decorator, Component, Node } from "cc";
import { Constants } from "../data/constants";
import { UpdateValueLabel } from "./update-value-label";
import { Revive } from "./revive";
const { ccclass, property } = _decorator;

@ccclass("PageResult")
export class PageResult extends Component {
    @property({ type: UpdateValueLabel })
    private scoreLabel: UpdateValueLabel = null!;
    private targetProgress: number = 0;
    @property(Node)
    private nodeTips1: Node = null!;
    @property(Node)
    private nodeTips2: Node = null!;
    @property(Node)
    private result: Node = null!;

    protected init(): void {
        this.targetProgress = 0;
        this.scoreLabel.playUpdateValue(this.targetProgress, this.targetProgress, 0);
        this.scoreLabel.isPlaying = false;

    }

    protected onEnable(): void {
        Constants.game.node.on(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.on(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
        Constants.game.node.on(Constants.GAME_EVENT.DYING, this.gameDie, this);
        this.showTips(true);
        this.showResult(false);
        this.init();
    }

    public start():void{
        const reviveComp = this.result.getComponent(Revive)!;
        reviveComp.pageResult = this;
    }

    protected onDisable():void {
        Constants.game.node.off(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.off(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
    }

    protected addScore(score: number): void {
        this.targetProgress = score;
        let curProgress = Number(this.scoreLabel.string);
        this.scoreLabel.playUpdateValue(curProgress, this.targetProgress, (this.targetProgress - curProgress) / 20);
    }

    protected gameDie(): void{
        this.showTips(false);
        this.showResult(true);
    }

    protected showTips(show: boolean): void{
        this.nodeTips1.active = show;
        this.nodeTips2.active = show;
    }

    protected hideTips(): void{
        this.showTips(false);
    }

    public showResult(isShow: boolean): void{
        this.result.active = isShow;
    }
}
