// @ts-ignore
import recommend from "collaborative-filter";
import { writeFile, readFileSync, existsSync } from "node:fs";
import path from "node:path";

export class Recommender {
  ratings: number[][];

  userId2Idx: Map<string, number>;
  idx2UserId: string[];
  itemId2Idx: Map<string, number>;
  idx2ItemId: string[];

  constructor();
  constructor(matrix: number[][], users: string[], items: string[]);
  constructor(matrix?: number[][], users?: string[], items?: string[]) {
    if (matrix && users && items) {
      this.ratings = Array.from(matrix);
      this.idx2UserId = Array.from(users);
      this.idx2ItemId = Array.from(items);
      this.userId2Idx = this.initMap(users);
      this.itemId2Idx = this.initMap(items);
    } else {
      this.ratings = [];
      this.userId2Idx = new Map<string, number>();
      this.idx2UserId = [];
      this.itemId2Idx = new Map<string, number>();
      this.idx2ItemId = [];
    }
  }

  private initMap(stringArr: string[]) {
    const map = new Map<string, number>();
    stringArr.forEach((s, i) => {
      map.set(s, i);
    });
    return map;
  }

  // #region
  get userNum() {
    return this.idx2UserId.length;
  }

  get itemNum() {
    return this.idx2ItemId.length;
  }

  addUser(userId: string, likes?: number[]) {
    const curUserNum = this.userNum;
    this.userId2Idx.set(userId, curUserNum);
    this.idx2UserId[curUserNum] = userId;
    if (likes) {
      this.ratings[curUserNum] = likes;
    } else {
      this.ratings[curUserNum] = new Array(this.itemNum).fill(0);
    }
  }

  addUsers(userArr: string[]) {
    for (const user of userArr) {
      this.addUser(user);
    }
  }

  addItem(itemId: string) {
    const currentItemNum = this.itemNum;
    this.itemId2Idx.set(itemId, currentItemNum);
    this.idx2ItemId[currentItemNum] = itemId;
    for (const user of this.ratings) {
      user[currentItemNum] = 0;
    }
  }

  addItems(itemArr: string[]) {
    for (const item of itemArr) {
      this.addItem(item);
    }
  }

  addVisit(userId: string, itemId: string) {
    let userIdx = this.getUserIdx(userId);
    let itemIdx = this.getItemIdx(itemId);
    if (userIdx == null) {
      this.addUser(userId);
      userIdx = this.getUserIdx(userId)!;
    }
    if (itemIdx == null) {
      this.addItem(itemId);
      itemIdx = this.getItemIdx(itemId)!;
    }
    this.ratings[userIdx][itemIdx] = 1;
  }

  addVisits(userId: string, itemIdArr: string[]) {
    let userIdx = this.getUserIdx(userId);
    if (userIdx == null) {
      this.addUser(userId);
      userIdx = this.getUserIdx(userId)!;
    }
    for (const itemId of itemIdArr) {
      let itemIdx = this.getItemIdx(itemId);
      if (itemIdx == null) {
        this.addItem(itemId);
        itemIdx = this.getItemIdx(itemId)!;
      }
      this.ratings[userIdx][itemIdx] = 1;
    }
  }

  getUserId(idx: number) {
    return this.idx2UserId[idx];
  }

  getUserIdx(id: string) {
    return this.userId2Idx.get(id);
  }

  getItemId(idx: number) {
    return this.idx2ItemId[idx];
  }

  getItemIdx(id: string) {
    return this.itemId2Idx.get(id);
  }

  getRecommend(userId: string) {
    const userIdx = this.getUserIdx(userId);
    if (userIdx == null) return [];
    const result = recommend.cFilter(this.ratings, userIdx) as number[];
    return result.map((itemIdx) => this.getItemId(itemIdx));
  }
  // #endregion

  persistence() {
    return new Promise<void>((resolve, reject) => {
      const chacheDir = process.env.CACHE_DIR || "";
      const jsonFileDir = path.resolve(chacheDir, "./recommend.json");
      const data = {
        matrix: this.ratings,
        users: this.idx2UserId,
        items: this.idx2ItemId,
      };
      writeFile(jsonFileDir, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static fromCache() {
    const chacheDir = process.env.CACHE_DIR || "";
    const jsonFileDir = path.resolve(chacheDir, "./recommend.json");
    if (!existsSync(jsonFileDir)) return new Recommender();
    const jsonString = readFileSync(jsonFileDir).toString();
    if (!jsonString) return new Recommender();
    const data = JSON.parse(jsonString);
    return new Recommender(data.matrix, data.users, data.items);
  }
}

export const recommender = Recommender.fromCache();
