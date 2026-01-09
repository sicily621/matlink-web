export interface Params {
    selectedTag: {
        buildingId: number; //建筑权限  10 无建筑 11全建筑 12指定建筑 13全楼层 14 指定楼层
        buildingInfo?: {
            parkId: number;  //园区id
            buildingId: number; //建筑id
            floorId: number; //楼层id
        },
        paramsType: number; //系统参数类型   0 无  1 系统分组  2 设备分组 3 场景 4 区域分组 5 设备模型 6 区域 7 能源类型 8 能源分项
        paramsId?: Array<string | number>; // 对应的系统参数id数组
        url?: string; //第三方链接
        sendUser: boolean; //是否发送用户
        systemId: string; //系统权限   20 无系统 21全系统 22 指定系统 
        systemList?: {
            systemId: number; //系统id
            subSystemList: string[] //子系统id数组
        }[];
    },
    search: {
        fieldAlias: string; //查询方式的名称
        fieldId: number; //表字段的id
        fieldName: string; //表字段的名称
        fieldDataType: number; //表字段的类型 5 时间类型
        modeWeek: boolean; //是否按周查询
        modeDay: boolean; //是否按日查询
        modeMonth: boolean; //是否按月查询
    },
    databaseSource: {
        databaseSourceType: number; //数据库类型 1 mysql
        dbId: string; //数据库id
        tablemodelId: string; //表id
    },
    isPage: boolean; //是否分页
    perPage: number; //每一页多少条目
    fields: {
        id: number; //表字段id
        projectId: number; //项目id
        tableId: number; //表id
        name: string; //表字段名称
        alias: string; //表字段别名
        dataType: number; //表字段类型
        length: number; //表字段长度
        sortNo: number; //表字段列表排序用
        sort: number; //更具表字段本身进行排序的类型 0 默认 1升序 2降序
        selected: boolean; //是否选中
        max: boolean; //最大
        min: boolean; //最小
        svg: boolean; //平均
        sum: boolean; //总和
    }[]
}


// selectedTag: {
//     buildingId: parseParams.selectedTag.buildingId,
//     buildingInfo: parseParams.selectedTag.buildingInfo,
//     paramsId: parseParams.selectedTag.selectedTag,
//     paramsType: parseParams.selectedTag.paramsType,
//     url: parseParams.selectedTag.url,
//     sendUser: parseParams.selectedTag.sendUser,
//     systemId: parseParams.selectedTag.systemId,
//     systemList
//   },
//   search: {
//     fieldAlias: parseParams.search.fieldAlias,
//     fieldId: parseParams.search.fieldId,
//     fieldName: parseParams.search.fieldName,
//     fieldDataType: parseParams.search.fieldDataType
//   },
//   databaseSource: {
//     tablemodelId: parseParams.databaseSource.tablemodelId,
//     dbId: parseParams.databaseSource.dbId,
//     databaseSourceType: parseParams.databaseSource.databaseSourceType
//   },
//   isPage: parseParams.isPage,
//   perPage: parseParams.perPage,
//   fields: parseParams.fields