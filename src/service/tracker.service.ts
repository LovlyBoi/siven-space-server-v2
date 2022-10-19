import { insertVisitDao, insertVisitorDao } from "../dao/tracker.dao";
import { nanoid } from "nanoid";
import { getCNRegion } from "../utils/getRegion";
import geoip from "geoip-lite";

class TrackerService {
  // 创建新游客
  createVisitor = async (ip: string) => {
    ip = "::ffff:42.100.183.172";
    const id = nanoid();
    const ipInfo = geoip.lookup(ip);
    if (!ipInfo) {
      throw new Error("client ip is invalid");
    }
    const region = getCNRegion(
      ipInfo.country,
      ipInfo.region,
      ipInfo.city,
      ipInfo.ll
    );
    // insertVisitorDao(id, ip);
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
}

export const trackerService = new TrackerService();
