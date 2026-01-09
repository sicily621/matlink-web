

export interface ConfigItem {
    id: number;
    functionType: number;
    factory: string;
    factoryFlag: string;
    selfThirdKey: {[key: string]: string};
    relation: any;
}


export interface ThirdInterface {
    //获取用户配置
    getUserConfig(cb: Function): void;
    //获取部门配置
    getDepartmentConfig(cb: Function): void;
    //获取角色配置
    getRoleConfigConfig(cb: Function): void;
    //查询用户信息
    getUserInfo(params: {[key: string]: any}, cb: Function): void;  
    //查询部门信息
    getDepartmentInfo(params: {[key: string]: any}, cb: Function): void;   
    //查询角色信息
    getRoleInfo(params: {[key: string]: any}, cb: Function): void;
}

