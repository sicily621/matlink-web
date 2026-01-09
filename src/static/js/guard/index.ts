import { HyGlobal } from '../../components/observer/HyGlobal';
type N = Function;
/**
 * 全局守卫 无用户登录信息跳转到登录页面
 * @param next 
 */
export const index = (next: N) => {
  const user = window.$HyGlobal.getUserInfo();
  if (user) next();
  else next({ name: 'login' });
}