import { _decorator, Component, Node, Vec3, Prefab, instantiate, MeshRenderer, Color } from "cc";
import { Constants } from "../data/constants";
import { Game } from "./game";
import { utils } from '../utils/utils';
const { ccclass, property } = _decorator;

const _tempPos = new Vec3();

@ccclass("Board")
export class Board extends Component {

    @property(Prefab)
    diamondPrefab: Prefab = null!;

    @property({ type: Prefab })
    centerPrefab: Prefab = null!;

    @property({ type: Prefab })
    wavePrefab: Prefab = null!;

    @property({ type: Prefab })
    springTopPrefab: Prefab = null!;

    @property({ type: Prefab })
    springHelixPrefab: Prefab = null!;

    isActive = false;
    diamondList: Node[] = [];
    type = Constants.BOARD_TYPE.NORMAL;
    wave: Node = null!;
    waveInner: Node = null!;
    waveOriginScale = new Vec3();
    currWaveFrame = 0;
    currSpringFrame = 0;
    currBumpFrame = Constants.BOARD_BUMP_FRAMES;
    springTop: Node = null!;
    springHelix: Node = null!;
    springHelixOriginScale = new Vec3();
    center: Node = null!;
    isMovingRight = true;
    hasDiamond = false;
    isMoving = false;
    posBeforeDrop = new Vec3();
    originScale = new Vec3();
    currDropFrame = Constants.BOARD_DROP_FRAMES;

    _game: Game = null!;

    onLoad() {
        this.originScale.set(this.node.scale);
        this.initCenter();
        this.initWave();
        this.initSpring();
    }

    update() {
        if (this.type === Constants.BOARD_TYPE.SPRING || this.type === Constants.BOARD_TYPE.SPRINT) {
        }
    }

    reset(type: number, pos: Vec3, level: number) {
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

    setDrop() {
        this.currDropFrame = 0;
        this.posBeforeDrop.set(this.node.position);
    }
    initSpring() {
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

    setSpring() {
        this.currSpringFrame = 0;
        this.setSpringPos();
        this.springHelix.setScale(1.5, 1, 1.5);
        this.springHelix.active = true;
        this.springTop.active = true;
    }

    setSpringPos() {
        let pos = this.node.position.clone();
        pos.y += Constants.BOARD_HEIGTH / 2;
        this.springHelix.setPosition(pos);
        pos = this.node.position.clone();
        pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
        this.springTop.setPosition(pos);
    }

    setBump() {
        this.currBumpFrame = 0;
    }
    initCenter() {
        this.center = instantiate(this.centerPrefab);
        this.node.parent!.addChild(this.center);
        this.center.active = false;
    }

    setCenterPos() {
        const pos = this.node.position.clone();
        pos.y += Constants.BOARD_HEIGTH / 2;
        this.center.setPosition(pos);
    }

    initWave() {
        this.wave = instantiate(this.wavePrefab);
        this.node.parent!.addChild(this.wave);
        this.wave.active = false;
        this.waveInner = instantiate(this.wavePrefab);
        this.node.parent!.addChild(this.waveInner);
        this.waveInner.active = false;
        this.currWaveFrame = Constants.BOARD_WAVE_FRAMES;
        this.waveOriginScale.set(this.wave.scale);
    }

    getHeight() {
        return this.type === Constants.BOARD_TYPE.DROP ? Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP : Constants.BOARD_HEIGTH;
    }

    getRadius() {
        return this.type === Constants.BOARD_TYPE.GIANT ? Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT : Constants.BOARD_RADIUS;

    }

    setMove(coeff: number): boolean {
        const t = utils.getDiffCoeff(coeff, 1, 10);
        return Math.random() * t > 5;
    }

    revive() {
        this.isActive = false;
        this.isMoving = false;
        if (this.type === Constants.BOARD_TYPE.DROP) {
            this.currDropFrame = Constants.BOARD_DROP_FRAMES;
            this.node.setPosition(this.posBeforeDrop);
        }
    }
}
