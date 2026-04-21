import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
/**
 * MD5字符串加密
 * @param str 
 * @returns 
 */
export const md5 = (str: string): string => CryptoJS.MD5(str).toString();

/**
 * Base64加密
 * @param message 
 * @returns 
 */
export const encodedBase64 = (message: string) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(message));

/**
 * Base64解密
 * @param base64 
 * @returns 
 */
export const decodeBase64 = (base64: string) => CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);

/**
 * DES加密
 * @param message,secretKey
 * @returns
 */
export const encodedEncrypt = (message: any,secretKey:string) => CryptoJS.DES.encrypt(message,secretKey).toString();

/**
 * DES解密
 * @param message,secretKey
 * @returns
 */
export const decodeDecrypt = (message: any,secretKey:string) => CryptoJS.DES.decrypt(message,secretKey).toString(CryptoJS.enc.Utf8);

/**
 * 非对称加密
 * @param data 
 * @param publicKey 公钥
 * @returns 
 */
export const RSAEncrypt = (data: any, publicKey: string) => {
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(data);
    return encrypted;
};
