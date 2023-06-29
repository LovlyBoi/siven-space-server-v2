export interface UserInfo {
  id: string;
  userName: string;
  password: string;
  role: 1 | 2 | 3;
  avatar: string;
  unuse: 0 | 1;
}

export type UserInfoSafe = Omit<UserInfo, 'password'>
