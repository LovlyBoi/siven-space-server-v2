import { wdPool } from "../app/database";
import {
  getDate,
  insertVisit,
  insertVisitor,
  createVisitTable,
  createVisitorsTable,
  CREATE_PV_RECORDS_TABLE,
  getVisitorCountByDate,
  COUNT_PV_RECORDS_BY_DATE,
  INSERT_NEW_PV_RECORDS,
  UPDATE_PV_RECORDS,
  SELECT_PV_BY_PERIOD,
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
    wdPool.execute(CREATE_PV_RECORDS_TABLE),
  ]);
}

// 查询每日访问量
async function countVisitorsForDate(year: number, month: number, date: number) {
  const result = (await wdPool.execute(
    getVisitorCountByDate(year, month, date)
  )) as any;
  return result[0][0]["count"];
}

// 查看是否有某日记录
async function pvRecordsExist(year: number, month: number, date: number) {
  const result = (await wdPool.execute(COUNT_PV_RECORDS_BY_DATE, [
    year,
    month,
    date,
  ])) as any;
  return !!result[0][0]["records"];
}

// 新增一天的pv记录
function addNewPvRecords(
  year: number,
  month: number,
  date: number,
  pv: number
) {
  return wdPool.execute(INSERT_NEW_PV_RECORDS, [year, month, date, pv]);
}

// 更新某天的 pv 记录
function updatePvRecords(
  year: number,
  month: number,
  date: number,
  pv: number
) {
  return wdPool.execute(UPDATE_PV_RECORDS, [pv, year, month, date]);
}

// 查找某段时间的pv
export async function selectPvByPeriod(start: string, end: string) {
  const result = (await wdPool.execute(SELECT_PV_BY_PERIOD, [
    start,
    end,
  ])) as any;
  return result[0]
}

// 更新今天的PV记录
export async function updateTodayVisitors() {
  const [year, month, date] = getDate();
  const count = await countVisitorsForDate(year, month, date);
  // 如果记录不存在，需要新增
  if (!(await pvRecordsExist(year, month, date))) {
    addNewPvRecords(year, month, date, count);
  } else {
    updatePvRecords(year, month, date, count);
  }
}

// updateTodayVisitors()
// selectPvByPeriod("2022-9-9", "2022-10-30");
