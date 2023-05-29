import { _decorator, Component, Node } from "cc";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
    @property(Node)
    private pageStart: Node = null!;
    @property(Node)
    private pageResult: Node = null!;

    protected onLoad(): void{
        Constants.game.uiManager = this;
    }

    protected start (): void {
        this.pageResult.active = false;
    }
    
    public showDialog(isMain: boolean, ...args: any[]): void{
        this.pageResult.active = !isMain;
        this.pageStart.active = isMain;
    }

}
