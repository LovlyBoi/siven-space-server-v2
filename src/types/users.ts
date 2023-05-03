export interface UserInfo {
  id: string;
  userName: string;
  password: string;
  role: 1 | 2;
  avatar: string;
  unuse: 0 | 1;
}

export type UserInfoSafe = Omit<UserInfo, 'password'>
