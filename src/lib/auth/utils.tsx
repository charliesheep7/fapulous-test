import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';
const USER = 'user';

export type TokenType = {
  access: string;
  refresh: string;
  expires_at?: number;
};

export type UserType = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export const getUser = () => getItem<UserType>(USER);
export const removeUser = () => removeItem(USER);
export const setUser = (value: UserType) => setItem<UserType>(USER, value);
