import { wdPool } from "../app/database";
import {
  insertVisit,
  insertVisitor,
  createVisitTable,
  createVisitorsTable,
} from "./statements";

// 创建新游客
export function insertVisitorDao(
  id: string,
  ip: string,
  country: string,
  region: string,
  city: string,
  longitude: number,
  latitude: number
) {
  return wdPool.execute(insertVisitor(), [
    id,
    ip,
    country,
    region,
    city,
    longitude,
    latitude,
  ]);
}

// 创新一个访问记录
export function insertVisitDao(visitorId: string, blogId: string) {
  return wdPool.execute(insertVisit(), [visitorId, blogId]);
}

// 创建当天的表
export function createTodayWebDataTable() {
  return Promise.all([
    wdPool.execute(createVisitorsTable()),
    wdPool.execute(createVisitTable()),
  ]);
}
