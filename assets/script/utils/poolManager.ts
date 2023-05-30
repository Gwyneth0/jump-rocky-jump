import { _decorator, Prefab, Node, instantiate, NodePool } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PoolManager")
export class PoolManager {

    private dictPool: { [name: string]: NodePool } = {}
    private dictPrefab: { [name: string]: Prefab } = {}
    static _instance: PoolManager;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new PoolManager();
        return this._instance;
    }

    public getNode(prefab: Prefab, parent: Node) {
        let name = prefab.data.name as string;
        this.dictPrefab[name] = prefab;
        let node: Node = null!;
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get()!;
            } else {
                node = instantiate(prefab);
            }
        } else {
            let pool = new NodePool();
            this.dictPool[name] = pool;
            node = instantiate(prefab);
        }
        node.parent = parent;
        return node;
    }

    public putNode(node: Node): void {
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            pool = this.dictPool[name];
        } else {
            pool = new NodePool();
            this.dictPool[name] = pool;
        }
        pool.put(node);
    }

    public clearPool(name: string): void {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }
}
