export enum ModeType {
    Env = 'env',
    Prod = 'prod',
    Mock = 'mock'
}


/**
 * 获取当前模式 
 */
export const getMode = () => import.meta.env.MODE;

/**
 * 判断是否是mock模式
 */
export const isMockMode = () => import.meta.env.MODE === ModeType.Mock; 