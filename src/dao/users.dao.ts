import { pool } from "../app/database";
import {
  CREATE_NEW_USER,
  GET_USER_INFO_BY_ID,
  GET_USER_INFO_BY_NAME,
  SEARCH_USERS_BY_ID_OR_NAME,
  UPDATE_USER_ROLE,
} from "./statements";

import { UserInfo, UserInfoSafe } from "../types";

export const createNewUser = (
  id: string,
  username: string,
  password: string,
  role: number,
  avatar: string
) => {
  return pool.execute(CREATE_NEW_USER, [id, username, password, role, avatar]);
};

export const getUserInfoById = async (id: string) => {
  const result = await pool.execute(GET_USER_INFO_BY_ID, [id]);
  return result[0] as unknown as UserInfo[];
};

export const getUserInfoByName = async (name: string) => {
  const result = await pool.execute(GET_USER_INFO_BY_NAME, [name]);
  return result[0] as unknown as UserInfo[];
};

export const searchUserByIdOrName = async (idOrName: string) => {
  const result = await pool.execute(SEARCH_USERS_BY_ID_OR_NAME, [
    '%' + idOrName + '%',
    '%' + idOrName + '%',
  ]);
  return result[0] as unknown as UserInfoSafe[];
};

export const updateUserRole = async (id: string, role: 1 | 2 | 3) => {
  return pool.execute(UPDATE_USER_ROLE, [role, id])
}
