import { _decorator, Component, Node, Touch, EventTouch, Vec3, Label, Prefab, ParticleSystem, Animation, Camera, ParticleUtils, find } from "cc";
import { Constants } from "../data/constants";
import { Board } from "./board";
import { utils } from "../utils/utils";
import { PoolManager } from "../utils/pool-manager";
const { ccclass, property } = _decorator;
const _tempPos = new Vec3();

@ccclass("Ball")
export class Ball extends Component {

    @property(Prefab)
    @property({ type: Prefab })
    private scoreAniPrefab: Prefab = null!;
    @property({ type: Prefab })
    private _currBoard: Board = null!;
    public get currBoard(): Board {
        return this._currBoard;
    }
    public set currBoard(value: Board) {
        this._currBoard = value;
    }
    private boardCount = 0;
    private jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
    private currBoardIdx = 0;
    private diffLevel = 1;
    private currJumpFrame = 0;
    private hasSprint = false;
    private isTouch = false;
    private touchPosX = 0;
    private movePosX = 0;
    private isJumpSpring = false;
    private boardGroupCount = 0;
    private timeScale = 0;
    private _wPos = new Vec3();

    protected start(): void {
        Constants.game.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        Constants.game.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Constants.game.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.reset();
    }

    protected onDestroy(): void {
        Constants.game.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        Constants.game.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Constants.game.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected update(deltaTime: number): void {
        this.timeScale = Math.floor((deltaTime / Constants.normalDt) * 100) / 100;
        if (Constants.game.state === Constants.GAME_STATE.PLAYING) {
            const boardBox = Constants.game.boardManager;
            const boardList = boardBox.getBoardList();
            if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
                if (this.currJumpFrame > Constants.BALL_JUMP_FRAMES_SPRINT) {
                    this.jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
                    this.isJumpSpring = false;
                    this.currJumpFrame = 0;
                    this.hasSprint = false;
                }
                this.currJumpFrame += this.timeScale;
                this.setPosY();
                this.setPosX();
                this.touchPosX = this.movePosX;
                const y = this.node.position.y + Constants.CAMERA_OFFSET_Y_SPRINT;
                Constants.game.cameraCtrl.setOriginPosY(y);
            } else {
                for (let i = this.currBoardIdx + 1; i >= 0; i--) {
                    const board = boardList[i];
                    const pos = this.node.position;
                    const boardPos = boardList[i].node.position;
                    if (Math.abs(pos.x - boardPos.x) <= boardList[i].getRadius() && Math.abs(pos.y - (boardPos.y + Constants.BOARD_HEIGTH))) {
                    }
                    if (this.jumpState === Constants.BALL_JUMP_STATE.FALLDOWN) {
                        if (this.currJumpFrame > Constants.PLAYER_MAX_DOWN_FRAMES || (this.currBoard.node.position.y - pos.y) - (Constants.BOARD_GAP + Constants.BOARD_HEIGTH) > 0.001) {
                            Constants.game.gameDie();
                            return;
                        }

                        if (this.isOnBoard(board)) {
                            this.currBoard = board;
                            this.currBoardIdx = i;
                            this.activeCurrBoard();
                            break;
                        }
                    }
                }
                this.currJumpFrame += this.timeScale;
                if (this.jumpState === Constants.BALL_JUMP_STATE.JUMPUP) {
                    if (this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES_SPRING) {
                        this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
                        this.currJumpFrame = 0;
                    } else {
                        if (!this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES) {
                            this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
                            this.currJumpFrame = 0;
                        }
                    }
                }
                this.setPosY();
                this.setPosX();
                if (this.currBoard.type !== Constants.BOARD_TYPE.SPRINT) {
                    Constants.game.cameraCtrl.setOriginPosX(this.node.position.x);
                }
                this.touchPosX = this.movePosX;
            }
        }
    }

    protected onTouchStart(touch: Touch, event: EventTouch): void {
        this.isTouch = true;
        this.touchPosX = touch.getLocation().x;
        this.movePosX = this.touchPosX;
    }

    protected onTouchMove(touch: Touch, event: EventTouch): void {
        this.movePosX = touch.getLocation().x;
    }

    protected onTouchEnd(touch: Touch, event: EventTouch): void {
        this.isTouch = false;
    }

    public reset(): void {
        this.boardCount = 0;
        this.diffLevel = 1;
        _tempPos.set(Constants.BOARD_INIT_POS);
        _tempPos.y += Constants.BALL_RADIUS + Constants.BOARD_HEIGTH / 2 - .001;
        this.node.setPosition(_tempPos);
        this.node.eulerAngles = new Vec3();
        this.currJumpFrame = 0;
        this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
        this.hasSprint = false;
        this.currBoardIdx = 0;
        this.show();
    }



    protected show(): void {
        this.node.active = true;
    }

    protected hide(): void {
        this.node.active = false;
    }

    protected activeCurrBoard(): void {
        const pos = this.node.position;
        const boardPos = this.currBoard.node.position;
        const boardType = this.currBoard.type;
        const y = boardPos.y + Constants.BALL_RADIUS + this.currBoard.getHeight() / 2 - .01;
        this.node.setPosition(pos.x, y, pos.z);
        this.currJumpFrame = 0;
        if (boardType === Constants.BOARD_TYPE.SPRINT) {
            this.jumpState = Constants.BALL_JUMP_STATE.SPRINT;
            Constants.game.cameraCtrl.setOriginPosX(boardPos.x);
        } else {
            this.jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
        }
        if (!this.currBoard.isActive) {
            this.currBoard.isActive = true;
            let score = Constants.SCORE_BOARD_NOT_CENTER;
            if (boardType !== Constants.BOARD_TYPE.NORMAL && boardType !== Constants.BOARD_TYPE.DROP || Math.abs(pos.x - boardPos.x) <= Constants.BOARD_RADIUS_CENTER) {
                score = Constants.SCORE_BOARD_CENTER;
            }
            Constants.game.addScore(score);
            this.showScore(score);
            this.boardCount++;
            if (this.boardCount === 5) {
                Constants.game.node.emit(Constants.GAME_EVENT.HIDETIPS);
            }
            this.diffLevel += score / 2;
            for (let l = this.currBoardIdx - Constants.BOARD_NEW_INDEX; l > 0; l--) {
                this.newBoard();
            }
        }
        this.isJumpSpring = boardType === Constants.BOARD_TYPE.SPRING;
        this.currBoard.setBump();
        if (boardType == Constants.BOARD_TYPE.SPRING || boardType == Constants.BOARD_TYPE.SPRINT) {
            this.currBoard.setSpring()
        }
        const boardList = Constants.game.boardManager.getBoardList();
        if (boardType === Constants.BOARD_TYPE.DROP) {
            for (let l = 0; l < this.currBoardIdx; l++) {
                boardList[l].setDrop();
            }
        }
        const c = boardPos.y + Constants.CAMERA_OFFSET_Y;
        Constants.game.cameraCtrl.setOriginPosY(c);
        Constants.game.cameraCtrl.preType = boardType;
    }

    protected newBoard(): void {
        let type = Constants.BOARD_TYPE.NORMAL;
        if (this.boardGroupCount <= 0) {
            const coeff = utils.getDiffCoeff(this.diffLevel, 1, 10);
            const t = Math.random() * coeff;
            if (t < 4.2) {
                type = Constants.BOARD_TYPE.NORMAL;
                this.boardGroupCount = 2;
            } else {
                type = Constants.BOARD_TYPE.NORMAL;
            }
        }
        this.boardGroupCount--;
        Constants.game.boardManager.newBoard(type, this.diffLevel);
    }

    protected showScore(score: number): void {
        const node = PoolManager.instance.getNode(this.scoreAniPrefab, find('Canvas/resultUI')!);
        const pos = new Vec3();
        const cameraComp = Constants.game.cameraCtrl.node.getComponent(Camera)!;
        this._wPos.set(this.node.worldPosition);
        cameraComp.convertToUINode(this._wPos, find('Canvas/resultUI')!, pos);
        pos.x += 50;
        node.setPosition(pos);
        node.getComponentInChildren(Label)!.string = `+${score}`;
        const animationComponent = node.getComponent(Animation)!;
        animationComponent.once(Animation.EventType.FINISHED, () => {
            PoolManager.instance.putNode(node);
        });
        animationComponent.play();
    }

    protected setPosX(): void {
        if (this.isTouch && this.touchPosX !== this.movePosX) {
            _tempPos.set(this.node.position);
            if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
                let x = (this.movePosX - this.touchPosX) * Constants.COEFF_POS_BALL;
                this.node.setPosition(_tempPos.x + x, _tempPos.y, _tempPos.z);
                _tempPos.set(this.node.position);
                x = _tempPos.x;
                let t = 1.3 * Constants.SCENE_MAX_OFFSET_X;
                const currBoardPos = this.currBoard.node.position;
                if (x > currBoardPos.x + t) {
                    this.node.setPosition(currBoardPos.x + t, _tempPos.y, _tempPos.z);
                } else if (x < this.currBoard.node.position.x - t) {
                    this.node.setPosition(currBoardPos.x - t, _tempPos.y, _tempPos.z);
                }
            } else {
                const x = (this.movePosX - this.touchPosX) * Constants.COEFF_POS_BALL;
                this.node.setPosition(_tempPos.x + x, _tempPos.y, _tempPos.z);
            }
        }
    }

    protected setPosY(): void {
        _tempPos.set(this.node.position);
        if (this.jumpState === Constants.BALL_JUMP_STATE.JUMPUP) {
            if (this.isJumpSpring) {
                _tempPos.y += Constants.BALL_JUMP_STEP_SPRING[Math.floor(this.currJumpFrame / 3)] * this.timeScale;
            } else {
                _tempPos.y += Constants.BALL_JUMP_STEP[Math.floor(this.currJumpFrame / 2)] * this.timeScale;
            }
            this.node.setPosition(_tempPos);
        } else if (this.jumpState === Constants.BALL_JUMP_STATE.FALLDOWN) {
            if (this.currBoard.type === Constants.BOARD_TYPE.SPRING) {
                if (this.currJumpFrame < Constants.BALL_JUMP_FRAMES_SPRING) {
                    const step = Constants.BALL_JUMP_FRAMES_SPRING - this.currJumpFrame - 1;
                    _tempPos.y -= Constants.BALL_JUMP_STEP_SPRING[Math.floor((step >= 0 ? step : 0) / 3)] * this.timeScale;
                } else {
                    _tempPos.y -= Constants.BALL_JUMP_STEP_SPRING[0] * this.timeScale;
                }
            } else if (this.currJumpFrame < Constants.BALL_JUMP_FRAMES) {
                const step = Constants.BALL_JUMP_FRAMES - this.currJumpFrame - 1;
                _tempPos.y -= Constants.BALL_JUMP_STEP[Math.floor((step >= 0 ? step : 0) / 2)] * this.timeScale;
            } else {
                _tempPos.y -= Constants.BALL_JUMP_STEP[0] * this.timeScale;
            }
            this.node.setPosition(_tempPos);
        } else if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
            _tempPos.y += Constants.BALL_JUMP_STEP_SPRINT * this.timeScale;
            this.node.setPosition(_tempPos);

        }
    }
    public isOnBoard(board: Board) {
        const pos = this.node.position;
        const boardPos = board.node.position;
        const x = Math.abs(pos.x - boardPos.x);
        const y = pos.y - boardPos.y;
        if (x <= board.getRadius()) {
            if (y >= 0 && y <= Constants.BALL_RADIUS + board.getHeight() / 2) {
                return true;
            }
            if (this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES_SPRING) {
                if (Math.abs(y) < Constants.BALL_JUMP_STEP_SPRING[0]) {
                    return true;
                }
            } else if (!this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES) {
                if (Math.abs(y) < Constants.BALL_JUMP_STEP[0]) {
                    return true;
                }
            }
        }
        return false;
    }

    public revive(): void {
        this.currBoardIdx--;
        if (this.currBoard.type === Constants.BOARD_TYPE.SPRINT) {
            this.currBoardIdx++;
            this.currBoard = Constants.game.boardManager.getBoardList()[this.currBoardIdx];
        }
        this.currBoard.revive();
        const pos = this.currBoard.node.position.clone();
        pos.y += Constants.BALL_RADIUS + this.currBoard.getHeight() / 2 - .001;
        this.node.setPosition(pos);
        this.node.eulerAngles = new Vec3(0, 0, 0);
        this.currJumpFrame = 0;
        this.show();
        const y = this.currBoard.node.position.y + Constants.CAMERA_OFFSET_Y;
        Constants.game.cameraCtrl.setOriginPosX(pos.x);
        Constants.game.cameraCtrl.setOriginPosY(y);
    }
}
