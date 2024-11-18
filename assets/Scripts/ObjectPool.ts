import { _decorator, Component, instantiate, Node, NodePool, Prefab, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ObjectPool")
export class ObjectPool extends Component {
  public prefabObjects: Prefab[] = [];
  private pools: { [key: string]: NodePool } = {};

  initPool() {
    for (const prefab of this.prefabObjects) {
      const pool = new NodePool();
      this.pools[prefab.name] = pool;
      const initCount = 3;
      for (let i = 0; i < initCount; i++) {
        const createObject = instantiate(prefab);
        pool.put(createObject);
      }
    }
  }

  addPool(prefab: Prefab, parentNode: Node, position: Vec3) {
    const prefabName = prefab.name;
    if (!this.pools[prefabName]) {
      console.error(`Pool for prefab ${prefabName} does not exist.`);
      return;
    }
    let createObject: Node;
    if (this.pools[prefabName].size() > 0) {
      createObject = this.pools[prefabName].get();
    } else {
      createObject = instantiate(prefab);
    }
    parentNode.addChild(createObject);
    createObject.setPosition(position);
    createObject.active = true;
  }

  returnToPool(object: Node) {
    const prefabName = object.name;
    object.active = false;
    object.parent = null;
    this.pools[prefabName].put(object);
  }

  reset() {
    for (const prefab of this.prefabObjects) {
      const pool = this.pools[prefab.name];
      if (pool) {
        pool.clear();
      }
    }
  }
}
