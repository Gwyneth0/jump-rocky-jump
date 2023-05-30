
import { _decorator, Component, Node, instantiate, Prefab } from "cc";
import { Constants } from "../data/constants";
import { Ball } from "./ball";
import { BoardManager } from "./board-manager";
import { CameraCtrl } from "./camera-ctrl";
import { UIManager } from "./ui-manager";
import { AudioManager } from "./audio-manager";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
    @property(Prefab)
    ballPref: Prefab = null!;
    @property(BoardManager)
    boardManager: BoardManager = null!;
    @property(CameraCtrl)
    cameraCtrl: CameraCtrl = null!;
    @property(UIManager)
    uiManager: UIManager = null!;
    @property(AudioManager)
    audioManager: AudioManager = null!;
    private _initFirstBoard = false;
    public get initFirstBoard() {
        return this._initFirstBoard;
    }
    public set initFirstBoard(value) {
        this._initFirstBoard = value;
    }
    get ball(){
        return this._ball;
    }
    state = Constants.GAME_STATE.READY;
    score = 0;
    hasRevive = false;
    _ball: Ball = null!;
    protected __preload (): void {
        Constants.game = this;
    }

    protected onLoad(): void{
        if (!this.ballPref) {
            console.log('There is no ball!!');
            this.enabled = false;
            return;
        }
        const ball = instantiate(this.ballPref) as Node;
        ball.parent = this.node.parent;
        this._ball = ball.getComponent(Ball)!;
    }

    protected start(): void{
        this.node.on(Constants.GAME_EVENT.RESTART, this.gameStart, this);
        this.node.on(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);
    }

    protected onDestroy(): void {
        this.node.off(Constants.GAME_EVENT.RESTART, this.gameStart, this);
        this.node.off(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);
    }

    protected resetGame(): void {
        this.state = Constants.GAME_STATE.READY;
        this._ball.reset();
        this.cameraCtrl.reset();
        this.boardManager.reset();
        this.uiManager.showDialog(true);
    }

    protected gameStart(): void{
        this.audioManager.playSound();
        this.uiManager.showDialog(false);
        this.state = Constants.GAME_STATE.PLAYING;
        this.hasRevive = false;
        this.score = 0;
    }

    public gameDie(): void{
        this.audioManager.playSound(false);
        this.state = Constants.GAME_STATE.PAUSE;

        if (!this.hasRevive) {
            this.node.emit(Constants.GAME_EVENT.DYING, ()=>{
                this.gameOver();
            });
        } else {
            this.gameOver();
        }
    }

    public gameOver(): void {
        this.state = Constants.GAME_STATE.OVER;
        this.audioManager.playSound(false);

        this.resetGame();
    }

    protected gameRevive(): void {
        this.hasRevive = true;
        this.state = Constants.GAME_STATE.READY;
        this.ball.revive();
        this.scheduleOnce(() => {
            this.audioManager.playSound();
            this.state = Constants.GAME_STATE.PLAYING;
        }, 1);
    }

    public addScore(score: number): void{
        this.score += score;
        this.node.emit(Constants.GAME_EVENT.ADDSCORE, this.score);
    }
}
