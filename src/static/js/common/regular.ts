// export enum regularEnum {
//     mobile = /^1[0-9]{10}$/,
//     email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g,
//     pwd = /^\S*(?=\S{8,16})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
//     numAll = /^(\-|\+)?\d+(\.\d+)?$/,
//     num = /^[0-9]*$/
// };
export const regularEnum = {
 mobile: /^1[0-9]{10}$/,
 email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g,
 pwd: /^\S*(?=\S{8,16})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
 numAll: /^(\-|\+)?\d+(\.\d+)?$/,
 num: /^[0-9]*$/,
} as const

/**
 * 验证手机号
 * @param mobile 手机号
 * @returns 
 */
export const isMobile = (mobile: string): boolean => regularEnum.mobile.test(mobile);

/**
 * 验证邮箱
 * @param email 邮箱
 * @returns 
 */
export const isEmail = (email: string): boolean => regularEnum.email.test(email);

/**
 * 验证密码
 * 8到16为必须包含大小写字母数字特殊符号
 */
export const isPwd = (pwd: string): boolean => regularEnum.pwd.test(pwd);

// export const isNumAll = (num: number): boolean => regularEnum.numAll.test(num);
export const isNumAll = (num: number): boolean => regularEnum.numAll.test(num.toString());
