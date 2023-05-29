import { _decorator, Component, Node, Vec3, Prefab, instantiate, MeshRenderer, Color } from "cc";
import { Constants } from "../data/constants";
import { Game } from "./game";
import { utils } from '../utils/utils';
const { ccclass, property } = _decorator;

const _tempPos = new Vec3();

@ccclass("Board")
export class Board extends Component {

    @property({ type: Prefab })
    private centerPrefab: Prefab = null!;

    @property({ type: Prefab })
    private wavePrefab: Prefab = null!;

    @property({ type: Prefab })
    private springTopPrefab: Prefab = null!;

    @property({ type: Prefab })
    private springHelixPrefab: Prefab = null!;

    private _isActive = false;
    public get isActive() {
        return this._isActive;
    }
    public set isActive(value) {
        this._isActive = value;
    }
    private _type = Constants.BOARD_TYPE.NORMAL;
    public get type() {
        return this._type;
    }
    public set type(value) {
        this._type = value;
    }
    private wave: Node = null!;
    private waveInner: Node = null!;
    private waveOriginScale = new Vec3();
    private _currWaveFrame = 0;
    public get currWaveFrame() {
        return this._currWaveFrame;
    }
    public set currWaveFrame(value) {
        this._currWaveFrame = value;
    }
    private _currSpringFrame = 0;
    public get currSpringFrame() {
        return this._currSpringFrame;
    }
    public set currSpringFrame(value) {
        this._currSpringFrame = value;
    }
    private _currBumpFrame = Constants.BOARD_BUMP_FRAMES;
    public get currBumpFrame() {
        return this._currBumpFrame;
    }
    public set currBumpFrame(value) {
        this._currBumpFrame = value;
    }
    private springTop: Node = null!;
    private springHelix: Node = null!;
    private _springHelixOriginScale = new Vec3();
    public get springHelixOriginScale() {
        return this._springHelixOriginScale;
    }
    public set springHelixOriginScale(value) {
        this._springHelixOriginScale = value;
    }
    private center: Node = null!;
    private _isMovingRight = true;
    public get isMovingRight() {
        return this._isMovingRight;
    }
    public set isMovingRight(value) {
        this._isMovingRight = value;
    }
    private _isMoving = false;
    public get isMoving() {
        return this._isMoving;
    }
    public set isMoving(value) {
        this._isMoving = value;
    }
    private posBeforeDrop = new Vec3();
    private originScale = new Vec3();
    private _currDropFrame = Constants.BOARD_DROP_FRAMES;
    public get currDropFrame() {
        return this._currDropFrame;
    }
    public set currDropFrame(value) {
        this._currDropFrame = value;
    }

    private _game: Game = null!;
    public get game(): Game {
        return this._game;
    }
    public set game(value: Game) {
        this._game = value;
    }

    protected onLoad(): void {
        this.originScale.set(this.node.scale);
        this.initCenter();
        this.initWave();
        this.initSpring();
    }

    protected update(): void {
        if (this.type === Constants.BOARD_TYPE.SPRING || this.type === Constants.BOARD_TYPE.SPRINT) {
        }
    }

    public reset(type: number, pos: Vec3, level: number): void {
        this.isActive = false;
        this.type = type;
        this.node.setPosition(pos);
        this.isMoving = false;
        this.currDropFrame = Constants.BOARD_DROP_FRAMES;
        if (this.type === Constants.BOARD_TYPE.NORMAL || this.type === Constants.BOARD_TYPE.DROP || this.type === Constants.BOARD_TYPE.SPRING) {
            this.isMoving = this.setMove(level);
        }
        if (this.type === Constants.BOARD_TYPE.GIANT) {
            this.node.setScale(this.originScale.x * Constants.BOARD_SCALE_GIANT, this.originScale.y, this.originScale.z);
        } else if (this.type === Constants.BOARD_TYPE.DROP) {
            this.node.setScale(this.originScale.x, this.originScale.y * Constants.BOARD_HEIGTH_SCALE_DROP, this.originScale.z);
            this.posBeforeDrop.set(this.node.position);
        } else {
            this.node.setScale(this.originScale);
        }
        this.springTop.active = false;
        if (this.type === Constants.BOARD_TYPE.SPRING || this.type === Constants.BOARD_TYPE.SPRINT) {
            this.springHelix.active = true;
            this.springTop.active = true;
            this.setSpringPos();
        }
    }

    public setDrop(): void {
        this.currDropFrame = 0;
        this.posBeforeDrop.set(this.node.position);
    }
    protected initSpring(): void {
        this.springHelix = instantiate(this.springHelixPrefab);
        this.springHelixOriginScale = this.springHelix.getScale();
        this.springHelix.setScale(1.5, 1, 1.5);
        this.node.parent!.addChild(this.springHelix);
        this.springHelix.active = false;
        this.currSpringFrame = 2 * Constants.BOARD_SPRING_FRAMES;
        this.springTop = instantiate(this.springTopPrefab);
        this.node.parent!.addChild(this.springTop);
        this.springTop.active = false;
        const pos = this.node.position.clone();
        pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
        this.springTop.setPosition(pos);
        this.setSpringPos();
    }

    public setSpring(): void {
        this.currSpringFrame = 0;
        this.setSpringPos();
        this.springHelix.setScale(1.5, 1, 1.5);
        this.springHelix.active = true;
        this.springTop.active = true;
    }

    private setSpringPos(): void {
        let pos = this.node.position.clone();
        pos.y += Constants.BOARD_HEIGTH / 2;
        this.springHelix.setPosition(pos);
        pos = this.node.position.clone();
        pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
        this.springTop.setPosition(pos);
    }

    public setBump(): void {
        this.currBumpFrame = 0;
    }
    private initCenter(): void {
        this.center = instantiate(this.centerPrefab);
        this.node.parent!.addChild(this.center);
        this.center.active = false;
    }

    public setCenterPos(): void {
        const pos = this.node.position.clone();
        pos.y += Constants.BOARD_HEIGTH / 2;
        this.center.setPosition(pos);
    }

    protected initWave(): void {
        this.wave = instantiate(this.wavePrefab);
        this.node.parent!.addChild(this.wave);
        this.wave.active = false;
        this.waveInner = instantiate(this.wavePrefab);
        this.node.parent!.addChild(this.waveInner);
        this.waveInner.active = false;
        this.currWaveFrame = Constants.BOARD_WAVE_FRAMES;
        this.waveOriginScale.set(this.wave.scale);
    }

    public getHeight() {
        return this.type === Constants.BOARD_TYPE.DROP ? Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP : Constants.BOARD_HEIGTH;
    }

    public getRadius() {
        return this.type === Constants.BOARD_TYPE.GIANT ? Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT : Constants.BOARD_RADIUS;

    }

    public setMove(coeff: number): boolean {
        const t = utils.getDiffCoeff(coeff, 1, 10);
        return Math.random() * t > 5;
    }

    public revive(): void {
        this.isActive = false;
        this.isMoving = false;
        if (this.type === Constants.BOARD_TYPE.DROP) {
            this.currDropFrame = Constants.BOARD_DROP_FRAMES;
            this.node.setPosition(this.posBeforeDrop);
        }
    }
}
