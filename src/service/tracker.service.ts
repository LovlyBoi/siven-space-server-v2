import {
  insertVisitDao,
  insertVisitorDao,
  selectPvByPeriod,
} from "../dao/tracker.dao";
import { nanoid } from "nanoid";
import { getCNRegion } from "../utils/getRegion";
import geoip from "geoip-lite";

class TrackerService {
  // 创建新游客
  createVisitor = async (ip: string) => {
    // ip = "::ffff:42.100.183.172";
    const id = nanoid();
    if (ip === "::ffff:127.0.0.1") {
      return {
        id,
        ip,
        ipInfo: 'localhost',
      };
    }
    const ipInfo = geoip.lookup(ip);
    if (!ipInfo) {
      throw new Error("client ip is invalid: " + ip);
    }
    // 中文的ip地址信息
    const region = getCNRegion(
      ipInfo.country,
      ipInfo.region,
      ipInfo.city,
      ipInfo.ll
    );
    insertVisitorDao(
      id,
      ip,
      ipInfo.country,
      ipInfo.region,
      ipInfo.city,
      ipInfo.ll[1], // latitude
      ipInfo.ll[0] // longitude
    );
    console.log(ipInfo);
    return {
      id,
      ip,
      ipInfo,
    };
  };
  // 创建新访问记录
  createVisit = (visitorId: string, blogId: string) =>
    insertVisitDao(visitorId, blogId);
  // 获取pv数
  getPv = async (startDate: Date, endDate: Date) => {
    const dateFormat = (d: Date) =>
      `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const start = dateFormat(startDate);
    const end = dateFormat(endDate);
    const records = await selectPvByPeriod(start, end);
    return records;
  };
}

export const trackerService = new TrackerService();
