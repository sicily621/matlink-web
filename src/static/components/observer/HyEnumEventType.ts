
export default class HyEnumEventType {
    public static UNKNOWN = new HyEnumEventType(-1, "Unknown", "未知");
    public static ENTERPRISE = new HyEnumEventType(1, "Enterprise", "企业");
    public static USER = new HyEnumEventType(2, "User", "用户");
    public static PARK = new HyEnumEventType(3, "Park", "园区");
    public static BUILDING = new HyEnumEventType(4, "Building", "建筑");
    public static FLOOR = new HyEnumEventType(5, "Floor", "楼层");
    public static ROOM = new HyEnumEventType(6, "Room", "房间");
    public static AREA = new HyEnumEventType(7, "Area", "区域");
    public static DEVICE_MODEL = new HyEnumEventType(8, "DeviceModel", "设备模型");
    public static DEVICE = new HyEnumEventType(9, "Device", "设备");
    public static TAG = new HyEnumEventType(10, "Tag", "设备点");
    public static COLLECTION_DEVICE_MODEL = new HyEnumEventType(11, "CollectionDeviceModel", "采集模型");
    public static COLLECTION_DEVICE = new HyEnumEventType(12, "CollectionDevice", "采集设备");
    public static COLLECTION_TAG = new HyEnumEventType(13, "CollectionTag", "采集点");
    public static ALARM = new HyEnumEventType(14, "Alarm", "报警");
    public static FAULT = new HyEnumEventType(15, "Fault", "故障");
    public static ORDER = new HyEnumEventType(16, "Order", "工单");
    public static LINKAGE = new HyEnumEventType(17, "Linkage", "联动");
    public static PATTERN = new HyEnumEventType(18, "Pattern", "模式");
    public static ACTIVITY = new HyEnumEventType(19, "Activity", "活动");
    public static TENANT = new HyEnumEventType(20, "Tenant", "租户");
    public static PROJECT = new HyEnumEventType(21, "Project", "项目");
    public static PACKAGE = new HyEnumEventType(22, "Package", "打包");
    public static DEVICEGROUP = new HyEnumEventType(23, "DeviceGroup", "设备组");
    public static SYSTEMCONFIG = new HyEnumEventType(24, "SystemConfig", "系统配置");
    public static DEPARTMENT = new HyEnumEventType(25, "Department", "部门");
    public static CONSTRUCTION = new HyEnumEventType(26, "Construction", "施工");
    public static PATROL = new HyEnumEventType(27, "VideoPatrol", "巡视");
    public static IOMASTERSTATUS = new HyEnumEventType(28, "IoMasterStatus", "IoMaster状态");
    public static IOSERVERSTATUS = new HyEnumEventType(29, "IoServerStatus", 'IoServer状态');
    public static ADAPTERSTATUS = new HyEnumEventType(30, "AdapterStatus", '适配器状态');
    public static DRIVERSTATUS = new HyEnumEventType(31, "DriverStatus", '驱动状态');
    public static COLLECTIONDEVICESTATUS = new HyEnumEventType(32, "CollectionDeviceStatus", '采集设备状态');
    public static DEVICESTATUS = new HyEnumEventType(33, "DeviceStatus", '设备状态');
    public static COLLECTIONTAGDATA = new HyEnumEventType(34, "CollectionTagData", '采集点状态');
    public static TAGDATA = new HyEnumEventType(35, "TagData", '点状态');
    public static WRITETAGDATA = new HyEnumEventType(36, "writeTagData", '写数据');

    // ... 其他枚举成员

    public static readonly values: HyEnumEventType[] = [
        HyEnumEventType.UNKNOWN,
        HyEnumEventType.ENTERPRISE,
        HyEnumEventType.USER,
        HyEnumEventType.PARK,
        HyEnumEventType.BUILDING,
        HyEnumEventType.FLOOR,
        HyEnumEventType.ROOM,
        HyEnumEventType.AREA,
        HyEnumEventType.DEVICE_MODEL,
        HyEnumEventType.DEVICE,
        HyEnumEventType.TAG,
        HyEnumEventType.COLLECTION_DEVICE_MODEL,
        HyEnumEventType.COLLECTION_DEVICE,
        HyEnumEventType.COLLECTION_TAG,
        HyEnumEventType.ALARM,
        HyEnumEventType.FAULT,
        HyEnumEventType.ORDER,
        HyEnumEventType.LINKAGE,
        HyEnumEventType.PATTERN,
        HyEnumEventType.ACTIVITY,
        HyEnumEventType.CONSTRUCTION,
        HyEnumEventType.TENANT,
        HyEnumEventType.PROJECT,
        HyEnumEventType.PACKAGE,
        HyEnumEventType.DEVICEGROUP,
        HyEnumEventType.SYSTEMCONFIG,
        HyEnumEventType.DEPARTMENT,
        HyEnumEventType.CONSTRUCTION,
        HyEnumEventType.PATROL,
        HyEnumEventType.IOMASTERSTATUS,
        HyEnumEventType.IOSERVERSTATUS,
        HyEnumEventType.ADAPTERSTATUS,
        HyEnumEventType.DRIVERSTATUS,
        HyEnumEventType.COLLECTIONDEVICESTATUS,
        HyEnumEventType.DEVICESTATUS,
        HyEnumEventType.COLLECTIONTAGDATA,
        HyEnumEventType.TAGDATA,
        HyEnumEventType.WRITETAGDATA


        // ... 添加所有枚举实例到数组
    ];

    private readonly type: number;
    private readonly name: string;
    private readonly cnName: string;

    private constructor(type: number, name: string, cnName: string) {
        this.type = type;
        this.name = name;
        this.cnName = cnName;
    }

    public getType(): number {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public getCnName(): string {
        return this.cnName;
    }

    public static getByName(name: string): HyEnumEventType {
        for (const value of HyEnumEventType.values) {
            if (value.getName() === name) {
                return value;
            }
        }
        return HyEnumEventType.UNKNOWN;
    }

    public static getByIndex(type: number): HyEnumEventType {
        for (const value of HyEnumEventType.values) {
            if (value.getType() === type) {
                return value;
            }
        }
        return HyEnumEventType.UNKNOWN;
    }

    public static getTypeName(type: number): string {
        const enumInstance = HyEnumEventType.getByIndex(type);
        return enumInstance ? enumInstance.getName() : HyEnumEventType.UNKNOWN.getName();
    }
}