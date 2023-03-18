type CompareFunc<T> = (a: T, b: T) => number;

export class Heap<T> {
  private arr: T[] = [];

  private compare: CompareFunc<T>;

  private _hasValue(val: unknown) {
    if (val === 0 || val === "") {
      return true;
    } else {
      return !!val;
    }
  }

  // * 获取元素父节点
  private _parent(i: number) {
    const value = this.arr[Math.floor(i / 2)];
    return this._hasValue(value) ? value : null;
  }

  private _leftChild(i: number) {
    const value = this.arr[i * 2];
    return this._hasValue(value) ? value : null;
  }

  private _rightChild(i: number) {
    const value = this.arr[i * 2 + 1];
    return this._hasValue(value) ? value : null;
  }

  private _swap(i: number, k: number) {
    const t = this.arr[i];
    this.arr[i] = this.arr[k];
    this.arr[k] = t;
  }

  // * 尝试上浮元素
  private _up(i: number) {
    while (i >= 1) {
      if (i === 1) return;
      const parent = this._parent(i)!;
      // 如果当前元素优先级更高，上浮元素
      if (this.compare(parent, this.arr[i]) > 0) {
        this._swap(i, Math.floor(i / 2));
        i = Math.floor(i / 2);
      } else {
        return;
      }
    }
  }

  // * 尝试下沉元素
  private _down(i: number) {
    while (i < this.arr.length - 1) {
      let left = this._leftChild(i);
      let right = this._rightChild(i);
      if (!this._hasValue(left)) {
        // 没有子节点
        return;
      } else if (!this._hasValue(right)) {
        // 只有左子节点
        if (this.compare(this.arr[i], left!) > 0) {
          this._swap(i, i * 2);
          i = i * 2;
        } else {
          return;
        }
      } else {
        // 两个子节点都有，判断哪个优先级更高
        let higherEl: T | null = null;
        let higherPos: number | null = null;
        if (this.compare(left!, right!) > 0) {
          // 右子节点更高，所以应该和右子节点比较交换
          higherEl = right;
          higherPos = 2 * i + 1;
        } else {
          higherEl = left;
          higherPos = 2 * i;
        }
        if (this.compare(this.arr[i], higherEl!) > 0) {
          this._swap(i, higherPos);
          i = higherPos;
        } else {
          return;
        }
      }
    }
  }

  constructor(compare: CompareFunc<T>) {
    this.compare = compare;
  }

  get size() {
    return this.arr.length - 1 < 0 ? 0 : this.arr.length - 1;
  }

  push(el: T) {
    // ToDo: 向堆末尾推入新元素，然后尝试上浮该元素
    this.arr.length === 0 ? (this.arr[1] = el) : this.arr.push(el);
    this._up(this.arr.length - 1);
  }

  peak() {
    return this.arr[1];
  }

  pop() {
    // ToDo: 返回并删除堆顶元素，将末尾元素放在堆顶，然后尝试下降该元素
    if (this.arr.length < 2) return;
    else if (this.arr.length === 2) {
      // 只有一个元素
      const val = this.arr[1];
      this.arr.length = 1;
      return val;
    } else {
      // 有多个元素
      this.arr[1] = this.arr[this.arr.length - 1];
      this.arr.length--;
      this._down(1);
    }
  }

  // * 实现迭代器，按照层序遍历
  *[Symbol.iterator]() {
    if (this.size < 1) return;
    for (let i = 1; i < this.arr.length; i++) {
      yield this.arr[i];
    }
  }

  // * 可迭代对象堆化
  static heapify<T>(arr: T[], compare: CompareFunc<T>) {
    const heap = new Heap<T>(compare);
    for (const item of arr) {
      heap.push(item);
    }
    return heap;
  }
}

// 小顶堆
export class MinHeap<T> extends Heap<T> {
  constructor() {
    super((a, b) => (a as number) - (b as number));
  }

  // * 可迭代对象堆化
  static heapify<T = number>(arr: T[]) {
    const heap = new MinHeap<T>();
    for (const item of arr) {
      heap.push(item);
    }
    return heap;
  }
}

// 大顶堆
export class MaxHeap<T> extends Heap<T> {
  constructor() {
    super((a, b) => (b as number) - (a as number));
  }

  // * 可迭代对象堆化
  static heapify<T = number>(arr: T[]) {
    const heap = new MaxHeap<T>();
    for (const item of arr) {
      heap.push(item);
    }
    return heap;
  }
}
