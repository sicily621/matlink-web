import { ref } from 'vue'
import { getValueList } from "./utils"
export const getCommunicationType = () => {
    return [
        {
            value: 1,
            label: "Serial",
            id: 1,
        },
        {
            value: 2,
            label: "Tcp",
            id: 2,
        },
        {
            value: 4,
            label: "Udp",
            id: 4,
        },
        {
            value: 8,
            label: "OPC",
            id: 8,
        },
        {
            value: 16,
            label: "Http",
            id: 16,
        },
        {
            value: 32,
            label: "Https",
            id: 32,
        },
        {
            value: 64,
            label: "Websocket",
            id: 64,
        },
        {
            value: 128,
            label: "SDK",
            id: 128,
        },
        {
            value: 256,
            label: "DB",
            id: 256,
        },
        {
            value: 512,
            label: "File",
            id: 512,
        },
        {
            value: 2048,
            label: "Other",
            id: 2048,
        },
    ]
};
export const getLevelType = () => {
    return [
        {
            value: 1,
            label: window.$i18nMFunc("publicType.level.low"),
            id: 1,
        },
        {
            value: 2,
            label: window.$i18nMFunc("publicType.level.medium"),
            id: 2,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.level.high"),
            id: 3,
        }
    ]
};
export const getAlarmType = () => {
    return [
        {
            value: 1,
            label: window.$i18nMFunc("publicType.alarm.limit"),
            id: 1,
        },
        {
            value: 2,
            label: window.$i18nMFunc("publicType.alarm.deviation"),
            id: 2,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.alarm.switch"),
            id: 3,
        },
        {
            value: 4,
            label: window.$i18nMFunc("publicType.alarm.threshold"),
            id: 4,
        },
        {
            value: 5,
            label: window.$i18nMFunc("publicType.alarm.rateOfChange"),
            id: 5,
        }
    ]
};
export const getAlarmState = () => {
    return [
        {
            value: 0,
            label: window.$i18nMFunc("publicType.alarmState.unconfirmed"),
            id: 0,
        },
        {
            value: 1,
            label: window.$i18nMFunc("publicType.alarmState.confirmed"),
            id: 1,
        },
        {
            value: 2,
            label: window.$i18nMFunc("publicType.alarmState.shielded"),
            id: 2,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.alarmState.falseAlarm"),
            id: 3,
        },
        {
            value: 4,
            label: window.$i18nMFunc("publicType.alarmState.toWorkOrder"),
            id: 4,
        },
        {
            value: 5,
            label: window.$i18nMFunc("publicType.alarmState.completed"),
            id: 5,
        },
        {
            value: 6,
            label: window.$i18nMFunc("publicType.alarmState.toWorkOrderFailed"),
            id: 6,
        },
        {
            value: 7,
            label: window.$i18nMFunc("publicType.alarmState.toFault"),
            id: 7,
        }
    ]
};
export const getFaultStatus = () => {
    return [
        {
            value: 0,
            label: window.$i18nMFunc("publicType.faultStatus.unconfirmed"),
            id: 0,
        },
        {
            value: 1,
            label: window.$i18nMFunc("publicType.faultStatus.confirmed"),
            id: 1,
        },
        {
            value: 2,
            label: window.$i18nMFunc("publicType.faultStatus.toWorkOrderFailed"),
            id: 2,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.faultStatus.toWorkOrder"),
            id: 3,
        },
        {
            value: 4,
            label: window.$i18nMFunc("publicType.faultStatus.completed"),
            id: 4,
        }
    ]
};
export const getFaultBtnState = () => {
    return [
        {
            value: 1,
            label: window.$i18nMFunc("publicType.faultBtnState.confirm"),
            id: 1,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.faultBtnState.toWorkOrder"),
            id: 3,
        },
        {
            value: 4,
            label: window.$i18nMFunc("publicType.faultBtnState.complete"),
            id: 4,
        },
    ]
};
export const getWriteTagDataStatus = () => {
    return [
        {
            id: 0,
            label: window.$i18nMFunc('publicType.writeTagDataStatus.success'),
            value: 0
        },
        {
            id: -1,
            label: window.$i18nMFunc('publicType.writeTagDataStatus.failed'),
            value: -1
        }
    ]
};
export const deviceStatus = () => {
    return [
        {
            id: 0,
            label: window.$i18nMFunc('publicType.deviceStatus.running'),
            value: 0
        },
        {
            id: 1,
            label: window.$i18nMFunc('publicType.deviceStatus.stopped'),
            value: 1
        },
        {
            id: 2,
            label: window.$i18nMFunc('publicType.deviceStatus.alarm'),
            value: 2
        },
        {
            id: 3,
            label: window.$i18nMFunc('publicType.deviceStatus.fault'),
            value: 3
        },
        {
            id: 4,
            label: window.$i18nMFunc('publicType.deviceStatus.offline'),
            value: 4
        }
    ]
};
export const dateType = () => {
    return [
        {
            id: '0',
            label: window.$i18nMFunc('publicType.dateType.number'),
            value: '0'
        },
        {
            id: '1',
            label: window.$i18nMFunc('publicType.dateType.string'),
            value: '1'
        },
        {
            id: '2',
            label: window.$i18nMFunc('publicType.dateType.boolean'),
            value: '2'
        },
        {
            id: '3',
            label: window.$i18nMFunc('publicType.dateType.ipAddress'),
            value: '3'
        },
        {
            id: '4',
            label: 'MAC',
            value: '4'
        },
        {
            id: '5',
            label: window.$i18nMFunc('publicType.dateType.date'),
            value: '5'
        },
        {
            id: '6',
            label: window.$i18nMFunc('publicType.dateType.port'),
            value: '6'
        },
        {
            id: '7',
            label: window.$i18nMFunc('publicType.dateType.array'),
            value: '7'
        },
        {
            id: '8',
            label: window.$i18nMFunc('publicType.dateType.structure'),
            value: '8'
        },
        {
            id: '9',
            label: window.$i18nMFunc('publicType.dateType.file'),
            value: '9'
        }
    ]
}
/**
 * factoryList
 * 这个数组顺序不要改动
 */
export const factoryList = () => {
    return [
        {
            id: '1',
            name: window.$i18nMFunc('publicType.factory.hikvision')
        },
        {
            id: '2',
            name: window.$i18nMFunc('publicType.factory.dahua')
        },
        {
            id: '3',
            name: window.$i18nMFunc('publicType.factory.uniview')
        },
        {
            id: '4',
            name: window.$i18nMFunc('publicType.factory.honeywell')
        },
        {
            id: '5',
            name: window.$i18nMFunc('publicType.factory.tiandy')
        },
        {
            id: '6',
            name: window.$i18nMFunc('publicType.factory.mingjing')
        },
        {
            id: '7',
            name: window.$i18nMFunc('publicType.factory.axis')
        },
        {
            id: '8',
            name: window.$i18nMFunc('publicType.factory.bosch')
        },
        {
            id: '9',
            name: window.$i18nMFunc('publicType.factory.infinova')
        },
        {
            id: '10',
            name: window.$i18nMFunc('publicType.factory.tyco')
        },
        {
            id: '11',
            name: window.$i18nMFunc('publicType.factory.univiewAI')
        },
        {
            id: '12',
            name: window.$i18nMFunc('publicType.factory.megvii')
        },
        {
            id: 13,
            name: window.$i18nMFunc('publicType.factory.cubic')
        },
    ]
}

export const versionList = () => {
    return [
        {
            id: '0',
            name: window.$i18nMFunc('publicType.version.version1')
        },
        {
            id: '1',
            name: window.$i18nMFunc('publicType.version.version2')
        },
        {
            id: '2',
            name: window.$i18nMFunc('publicType.version.version3')
        },
    ]
}
export const cameraTypeList = () => {
    return [
        {
            id: 1,
            label: window.$i18nMFunc('publicType.cameraType.domeWithPtz'),
        },
        {
            id: 2,
            label: window.$i18nMFunc('publicType.cameraType.bulletWithPtz'),
        },
        {
            id: 3,
            label: window.$i18nMFunc('publicType.cameraType.ptz'),
        },
        {
            id: 4,
            label: window.$i18nMFunc('publicType.cameraType.domeWithoutPtz'),
        },
        {
            id: 5,
            label: window.$i18nMFunc('publicType.cameraType.bulletWithoutPtz'),
        }
    ]
};
export const quantityList = () => {
    return [
        {
            id: -1,
            name: 'invalid',
        },
        {
            id: 0,
            name: 'bad',
        },
        {
            id: 1,
            name: 'good',
        },
        {
            id: 2,
            name: 'good_old',
        },
        {
            id: 3,
            name: 'simulated',
        }
    ]
}
// 认证用户-枚举值
export const InterfaceNnum = () => {
    return [
        { 1: window.$i18nMFunc('publicType.interface.user') },
        { 2: window.$i18nMFunc('publicType.interface.project') },
        { 3: window.$i18nMFunc('publicType.interface.space') },
        { 4: window.$i18nMFunc('publicType.interface.device') },
        { 5: window.$i18nMFunc('publicType.interface.alarm') },
        { 6: window.$i18nMFunc('publicType.interface.fault') },
        { 7: window.$i18nMFunc('publicType.interface.energy') }
    ]
}


export const getRepairsIncidentsStatus = () => {
    return [
        {
            id: 1,
            value: 1,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.notDispatched')
        },
        {
            id: 2,
            value: 2,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.notAccepted')
        },
        {
            id: 3,
            value: 3,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.accepted')
        },
        {
            id: 4,
            value: 4,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.completed')
        },
        {
            id: 5,
            value: 5,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.reviewed')
        },
        {
            id: 6,
            value: 6,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.returned')
        },
        {
            id: 7,
            value: 7,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.suspended')
        },
        {
            id: 8,
            value: 8,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.terminated')
        },
        {
            id: 9,
            value: 9,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.rejected')
        },
        {
            id: 10,
            value: 10,
            label: window.$i18nMFunc('publicType.repairsIncidentsStatus.cancelled')
        },
    ]
};
export const getRepairsIncidentsLevel = () => {
    return [
        {
            value: 1,
            label: window.$i18nMFunc("publicType.repairsIncidentsLevel.normal"),
            id: 1,
        },
        {
            value: 2,
            label: window.$i18nMFunc("publicType.repairsIncidentsLevel.severe"),
            id: 2,
        },
        {
            value: 3,
            label: window.$i18nMFunc("publicType.repairsIncidentsLevel.urgent"),
            id: 3,
        }
    ]
}
export const workOrderStatus = () => {
    return [
        {
            value: 0,
            label: window.$i18nMFunc('publicType.workOrderStatus.notDispatched'),
            id: 1,
        },
        {
            value: 1,
            label: window.$i18nMFunc('publicType.workOrderStatus.accepted'),
            id: 2,
        },
        {
            value: 2,
            label: window.$i18nMFunc('publicType.workOrderStatus.onSite'),
            id: 3,
        },
        {
            value: 3,
            label: window.$i18nMFunc('publicType.workOrderStatus.completed'),
            id: 4,
        },
        {
            value: 4,
            label: window.$i18nMFunc('publicType.workOrderStatus.closed'),
            id: 5
        },
        {
            value: 5,
            label: window.$i18nMFunc('publicType.workOrderStatus.returned'),
            id: 6,
        },
        {
            value: 6,
            label: window.$i18nMFunc('publicType.workOrderStatus.suspended'),
            id: 7,
        },
        {
            value: 7,
            label: window.$i18nMFunc('publicType.workOrderStatus.terminated'),
            id: 8,
        },
        {
            value: 8,
            label: window.$i18nMFunc('publicType.workOrderStatus.rejected'),
            id: 9,
        },
        {
            value: 9,
            label: window.$i18nMFunc('publicType.workOrderStatus.repair'),
            id: 10,
        },
    ]
}

export const getScreenTemplateType = () => {
    return [
        {
            id: 1,
            value: 10,
            label: window.$i18nMFunc('publicType.screenTemplateType.leftScreen')
        },
        {
            id: 2,
            value: 11,
            label: window.$i18nMFunc('publicType.screenTemplateType.leftScreenWithMap')
        },
        {
            id: 3,
            value: 20,
            label: window.$i18nMFunc('publicType.screenTemplateType.middlescreen'),
        },
        {
            id: 4,
            value: 21,
            label: window.$i18nMFunc('publicType.screenTemplateType.mediumScreenWithMap'),
        },
        {
            id: 5,
            value: 30,
            label: window.$i18nMFunc('publicType.screenTemplateType.rightScreen'),
        },
        {
            id: 6,
            value: 31,
            label: window.$i18nMFunc('publicType.screenTemplateType.rightScreenWithMap'),
        },
        {
            id: 7,
            value: 0,
            label: window.$i18nMFunc('publicType.screenTemplateType.independence'),
        }
    ]
}
// 工单类型
export const getWorkOrderTimeoutStatus = () => {
    return [
        {
            id: 1,
            value: 1,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.notDispatched')
        },
        {
            id: 2,
            value: 2,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.dispatched')
        },
        {
            id: 3,
            value: 3,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.accepted')
        },
        {
            id: 4,
            value: 4,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.transferred')
        },
        {
            id: 5,
            value: 5,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.returned')
        },
        {
            id: 6,
            value: 6,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.suspended')
        },
        {
            id: 7,
            value: 7,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.terminated')
        },
        {
            id: 8,
            value: 8,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.completed')
        },
        {
            id: 9,
            value: 9,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.reviewed')
        },
        {
            id: 10,
            value: 10,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.cancelled')
        },
        {
            id: 11,
            value: 11,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.present')//到场
        },
        {
            id: 12,
            value: 12,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.massTexting')//群发
        },
        {
            id: 13,
            value: 13,
            label: window.$i18nMFunc('publicType.workOrderTimeoutStatus.transferOrder')//转单
        }
    ]
};
