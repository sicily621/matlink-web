import { CacheKey } from "@@/constants/cache-key";

export function getToken() {
  return sessionStorage.getItem(CacheKey.TOKEN);
}

export function setToken(token: string, value: number) {
  sessionStorage.setItem(CacheKey.TOKEN, token);
}

export function removeToken() {
  sessionStorage.removeItem(CacheKey.TOKEN);
}

export function getUserInfo() {
  return sessionStorage.getItem(CacheKey.USER_INFO);
}

export function setUserInfo(userInfo: any, value: number) {
  sessionStorage.setItem(CacheKey.USER_INFO, userInfo);
}

export function removeUserInfo() {
  sessionStorage.removeItem(CacheKey.USER_INFO);
}

export function getPermission() {
  return sessionStorage.getItem(CacheKey.PERMISSION);
}

export function setPermission(permisson: any, value: number) {
  sessionStorage.setItem(CacheKey.PERMISSION, permisson);
}

export function removePermission() {
  sessionStorage.removeItem(CacheKey.PERMISSION);
}
