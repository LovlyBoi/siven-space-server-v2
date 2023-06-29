import { hash, compare } from "./bcrypt";

describe("bcrypt算法测试", () => {
  it("测试相同简单密码哈希值是否一致", () => {
    const easyCode = "123456";
    const result = Array(10)
      .fill(easyCode)
      .map((code) => hash(code));
    Promise.all(result).then((rs) => {
      rs.forEach((r, i, rs) => {
        if (i > 0) {
          expect(r).not.toBe(rs[i - 1]);
        }
      });
    });
  });
  it("随机密码测试", () => {
    function generateCodeString(length = 10) {
      const CHAR_SET =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
      const CHAR_SET_LEN = CHAR_SET.length;
      let res = "";
      for (let i = 0; i < length; i += 1) {
        res += CHAR_SET[Math.floor(Math.random() * CHAR_SET_LEN)];
      }
      return res;
    }
    for (let i = 0; i < 20; i += 1) {
      const code = generateCodeString();
      hash(code)
        .then((value) => {
          return compare(code, value);
        })
        .then((result) => {
          expect(result).toBe(true);
        });
    }
  });
});
