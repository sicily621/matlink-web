import { ThirdInterface, ConfigItem } from '../index';
import { xwfuGet, post } from '@static/js/http/http';


export class ThirdConfig implements ThirdInterface {

    //获取用户配置
    getUserConfig(cb: Function) {
        xwfuGet(`/service/center/common/user/main/oauth2/third/relation/config/getUserConfig`, {
            factoryFlag: 'guohui'
        }, (res: any) => {
            cb({
                id: res.data.id,
                functionType:  res.data.functionType,
                factory: res.data.factory,
                factoryFlag: res.data.factoryFlag,
                selfThirdKey: JSON.parse(res.data.selfThirdKey),
                otherRelation: {},
                relation: res.data.relation
            });
        })
            
    }
    //获取部门配置
    getDepartmentConfig(cb: Function) {
        xwfuGet(`/service/center/common/user/main/oauth2/third/relation/config/getDepartmentConfig`, {
            factoryFlag: 'guohui'
        }, (res: any) => {
            cb({
                id: res.data.id,
                functionType:  res.data.functionType,
                factory: res.data.factory,
                factoryFlag: res.data.factoryFlag,
                selfThirdKey: JSON.parse(res.data.selfThirdKey),
                otherRelation: {},
                relation: res.data.relation
            });
        })
    };
    //获取角色配置
    getRoleConfigConfig(cb: Function) {
        xwfuGet(`/service/center/common/user/main/oauth2/third/relation/config/getRoleConfig`, {
            factoryFlag: 'guohui'
        }, (res: any) => {
            cb({
                id: res.data.id,
                functionType:  res.data.functionType,
                factory: res.data.factory,
                factoryFlag: res.data.factoryFlag,
                selfThirdKey: JSON.parse(res.data.selfThirdKey),
                otherRelation: {},
                relation: res.data.relation
            });
        })
    };
    //查询用户信息
    getUserInfo(params: {[key: string]: any}, cb: Function) {
        post(`/service/center/common/user/main/oauth2/third/relation/data/findUser`, params, (res: any) => {
            cb(res.data);
        })
    };  
    //查询部门信息
    getDepartmentInfo(params: {[key: string]: any}, cb: Function) {
        post(`/service/center/common/user/main/oauth2/third/relation/data/findDepartment`, params, (res: any) => {
            cb(res.data);
        })
    };   
    //查询角色信息
    getRoleInfo(params: {[key: string]: any}, cb: Function): any {
        post(`/service/center/common/user/main/oauth2/third/relation/data/findRole`, params, (res: any) => {
            cb(res.data);
        })
    };

}