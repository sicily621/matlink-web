import { isInteger, isString, isBoolean, isIP, isMac, isDateTime, isPort, isArray, isFilePath } from "./utils"
export class HyJsonParamType {
    public static UNKNOWN = new HyJsonParamType(-1, "未知");
    public static TYPE_INTEGER = new HyJsonParamType(0, "整数", isInteger);
    public static TYPE_STRING = new HyJsonParamType(1, "字符串", isString);
    public static TYPE_BOOL = new HyJsonParamType(2, "布尔", isBoolean);
    public static TYPE_IP = new HyJsonParamType(3, "IP地址或域名", isIP);
    public static TYPE_MAC = new HyJsonParamType(4, "MAC地址", isMac);
    public static TYPE_DATETIME = new HyJsonParamType(5, "时间", isDateTime);
    public static TYPE_IP_PORT = new HyJsonParamType(6, "端口", isPort);
    public static TYPE_ARRAY = new HyJsonParamType(7, "数组", isArray);
    public static TYPE_STRUCT = new HyJsonParamType(8, "结构体");
    public static TYPE_FILE_PATH = new HyJsonParamType(9, "文件路径", isFilePath);


    public static readonly values: HyJsonParamType[] = [
        HyJsonParamType.UNKNOWN,
        HyJsonParamType.TYPE_INTEGER,
        HyJsonParamType.TYPE_STRING,
        HyJsonParamType.TYPE_BOOL,
        HyJsonParamType.TYPE_IP,
        HyJsonParamType.TYPE_MAC,
        HyJsonParamType.TYPE_DATETIME,
        HyJsonParamType.TYPE_IP_PORT,
        HyJsonParamType.TYPE_ARRAY,
        HyJsonParamType.TYPE_STRUCT,
        HyJsonParamType.TYPE_FILE_PATH
    ];

    private readonly type: number;
    private readonly name: string;
    private readonly validator: Function = () => true;

    private constructor(type: number, name: string, validator?: Function) {
        this.type = type;
        this.name = name;
        validator && (this.validator = validator);
    }

    public getType(): number {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public getValidator(): Function {
        return this.validator;
    }

    public static getByType(type: number): HyJsonParamType {
        for (const value of HyJsonParamType.values) {
            if (value.getType() === type) {
                return value;
            }
        }
        return HyJsonParamType.UNKNOWN;
    }

    public static getOptions(): { id: number; label: string; value: number }[] {
        const options = []
        for (const value of HyJsonParamType.values) {
            const option = {
                value: value.getType(),
                label: value.getName(),
                id: value.getType(),
            }
            options.push(option)

        }
        return options;
    }
}
//获取驱动原型的数据类型下拉数据
export const getJsonParamType = () => {
    return HyJsonParamType.getOptions()
}
//根据类型id获取驱动原型的数据类型
export const getByType = (type: number) => {
    return HyJsonParamType.getByType(type)
}