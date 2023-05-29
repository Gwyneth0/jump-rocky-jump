import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from "cc";
import { Board } from "./board";
import { Constants } from "../data/constants";
import { utils } from "../utils/utils";
const { ccclass, property } = _decorator;

const _tempPos = new Vec3();
const _diamondPos = new Vec3();

@ccclass("BoardManager")
export class BoardManager extends Component {
    @property(Prefab)
    boardPrefab: Prefab = null!;

    _boardList: Board[] = []; 
    _boardInsIdx = 0; 

    start () {
        this.initBoard();
    }

    reset(){
        this._boardInsIdx = 0;
        Constants.game.initFirstBoard = false;
        let pos = Constants.BOARD_INIT_POS.clone();
        let board: Board;
        const type = Constants.BOARD_TYPE.NORMAL;
        for (let i = 0; i < Constants.BOARD_NUM; i++) {
            board = this._boardList[i];
            board.reset(type, pos, 1);
            pos = this.getNextPos(board, 1);
        }

        board = this._boardList[0];
        board.isActive = true;
        Constants.game.ball.currBoard = board;
    }

    initBoard() {
        for (let i = 0; i < Constants.BOARD_NUM; i++) {
            const node = instantiate(this.boardPrefab) as Node;
            node.name = this._boardInsIdx.toString();
            this._boardInsIdx++;
            this.node.addChild(node);
            const board = node.getComponent('Board') as Board;
            this._boardList.push(board);
        }
        this.reset();
    }

    newBoard(newType: number, diffLevel: number) {
        const oldBoard = this._boardList[Constants.BOARD_NUM - 1];
        const pos = this.getNextPos(oldBoard, diffLevel, _tempPos);
        const board = this._boardList.shift()!;
        if (newType === Constants.BOARD_TYPE.SPRINT) {
            board.reset(newType, pos, 0);
        } else {
            board.reset(newType, pos, diffLevel);
        }

        board.name = this._boardInsIdx.toString();
        this._boardInsIdx++;
        this._boardList.push(board);
    }

    getNextPos(board: Board, count: number, out?: Vec3) {
        const pos: Vec3 = out ? out.set(board.node.position) : board.node.position.clone();
        const o = utils.getDiffCoeff(count, 1, 2);
        pos.x = (Math.random() - .5) * Constants.SCENE_MAX_OFFSET_X * o;
        if (board.type === Constants.BOARD_TYPE.SPRINT) {
            pos.y += Constants.BOARD_GAP_SPRINT;
            pos.x = board.node.position.x;
        }

        if (board.type === Constants.BOARD_TYPE.SPRING) {
            pos.y += Constants.BOARD_GAP_SPRING;
        } else {
            pos.y += Constants.BOARD_GAP;
        }
        return pos;
    }
    getBoardList() {
        return this._boardList;
    }

}
