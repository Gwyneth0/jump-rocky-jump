import { _decorator, Component, Node, Vec3 } from "cc";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;
const _tempPos = new Vec3();

@ccclass("CameraCtrl")
export class CameraCtrl extends Component {

    @property(Node)
    private planeNode: Node = null!;
    private _preType = Constants.BOARD_TYPE.NORMAL;
    public get preType() {
        return this._preType;
    }
    public set preType(value) {
        this._preType = value;
    }
    private _originPos = new Vec3();

    protected start(): void {
        this._originPos.set(Constants.CAMERA_INIT_POS);
        this.setPosition(this._originPos);
        this.node.eulerAngles = Constants.CAMERA_INIT_ROT;
    }

    public setOriginPosX(val: number): void {
        this._originPos.x = val;
    }

    public setOriginPosY(val: number): void {
        this._originPos.y = val;
    }

    protected update(): void {
        _tempPos.set(this.node.position);
        if (_tempPos.x === this._originPos.x && _tempPos.y === this._originPos.y) {
            return;
        }
        if (Math.abs(_tempPos.x - this._originPos.x) <= Constants.CAMERA_MOVE_MINI_ERR) {
            _tempPos.x = this._originPos.x;
            this.setPosition(_tempPos);
        } else {
            const x = this._originPos.x - _tempPos.x;
            _tempPos.x += x / Constants.CAMERA_MOVE_X_FRAMES;
            this.setPosition(_tempPos);
        }
        _tempPos.set(this.node.position);
        if (Math.abs(_tempPos.y - this._originPos.y) <= Constants.CAMERA_MOVE_MINI_ERR) {
            _tempPos.y = this._originPos.y;
            this.setPosition(_tempPos);
        } else {
            const y = this._originPos.y - _tempPos.y;
            if (this.preType === Constants.BOARD_TYPE.SPRING) {
                _tempPos.y += y / Constants.CAMERA_MOVE_Y_FRAMES_SPRING;

                this.setPosition(_tempPos);
            } else {
                _tempPos.y += y / Constants.CAMERA_MOVE_Y_FRAMES;
                this.setPosition(_tempPos);
            }
        }
    }

    public reset(): void {
        this._originPos.set(Constants.CAMERA_INIT_POS);
        this.setPosition(this._originPos);
    }

    protected setPosition(position: Vec3): void {
        this.node.setPosition(position);
        const y = position.y - 27;
        this.planeNode.setPosition(position.x, y, -100);
    }
}
