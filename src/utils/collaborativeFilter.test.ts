import { Recommender } from "./collaborativeFilter";

describe("协同过滤算法封装类测试", () => {
  it("新建类测试(矩阵-id数组测试)", () => {
    const r1 = new Recommender();
    expect(r1.idx2UserId).toEqual([]);
    expect(r1.idx2ItemId).toEqual([]);
    expect(r1.ratings).toEqual([]);
    const dommy = [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
    ];
    const users = ["user1", "user2", "user3"];
    const items = ["item1", "item2", "item3"];
    const r2 = new Recommender(dommy, users, items);
    expect(r2.idx2UserId).toEqual(users);
    expect(r2.idx2UserId).not.toBe(users);
    expect(r2.idx2ItemId).toEqual(items);
    expect(r2.idx2ItemId).not.toBe(items);
    expect(r2.ratings).toEqual(dommy);
    expect(r2.ratings).not.toBe(dommy);
  });
  it("新建类测试(内置id哈希表测试)", () => {
    const r1 = new Recommender();
    r1.idx2UserId.forEach((userId, idx) => {
      expect(r1.userId2Idx.get(userId)).toBe(idx);
    });
    r1.idx2ItemId.forEach((itemId, idx) => {
      expect(r1.itemId2Idx.get(itemId)).toBe(idx);
    });
    const dommy = [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
    ];
    const users = ["user1", "user2", "user3"];
    const items = ["item1", "item2", "item3"];
    const r2 = new Recommender(dommy, users, items);
    r2.idx2UserId.forEach((userId, idx) => {
      expect(r2.userId2Idx.get(userId)).toBe(idx);
    });
    r2.idx2ItemId.forEach((itemId, idx) => {
      expect(r2.itemId2Idx.get(itemId)).toBe(idx);
    });
  });
  it("类功能测试(添加user/item测试)", () => {
    const r = new Recommender();
    expect(r.idx2UserId).toEqual([]);
    expect(r.idx2ItemId).toEqual([]);
    expect(r.ratings).toEqual([]);
    r.addUser("user1");
    expect(r.idx2UserId).toEqual(["user1"]);
    expect(r.idx2ItemId).toEqual([]);
    r.addUsers(["user2", "user3"]);
    expect(r.idx2UserId).toEqual(["user1", "user2", "user3"]);
    expect(r.idx2ItemId).toEqual([]);
    r.addItem("item1");
    expect(r.idx2UserId).toEqual(["user1", "user2", "user3"]);
    expect(r.idx2ItemId).toEqual(["item1"]);
    r.addItems(["item2", "item3"]);
    expect(r.idx2UserId).toEqual(["user1", "user2", "user3"]);
    expect(r.idx2ItemId).toEqual(["item1", "item2", "item3"]);
  });
  it("类功能测试(添加访问记录测试)", () => {
    const dommy = [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
    ];
    const users = ["user1", "user2", "user3"];
    const items = ["item1", "item2", "item3"];
    const r = new Recommender(dommy, users, items);
    const rRatings = r.ratings;
    r.addVisit("user1", "item3");
    const dommy2 = [
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
    ];
    expect(r.ratings).toBe(rRatings);
    expect(r.ratings).toEqual(dommy2);
    r.addVisits("user4", ["item1", "item2"]);
    const dommy3 = [
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 0],
    ];
    expect(r.ratings).toBe(rRatings);
    expect(r.ratings).toEqual(dommy3);
  });
  it("推荐算法测试(推荐结果测试)", () => {
    const dommy = [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
    ];
    const users = ["user1", "user2", "user3"];
    const items = ["item1", "item2", "item3"];
    const r = new Recommender(dommy, users, items);
    expect(r.getRecommend("user1")).toEqual(["item2", "item3"]);
    expect(r.getRecommend("user2")).toEqual(["item3"]);
    expect(r.getRecommend("user3")).toEqual(["item2"]);
  });
});
