
export default class HyEnumDataType {
    public static UNKNOWN = new HyEnumDataType(-1, "Unknown");
    public static THEME = new HyEnumDataType(1, "Theme");
    public static MAPDEVICE = new HyEnumDataType(2, "MapDevice");
    public static PROJECT = new HyEnumDataType(3, "Project");
    public static TIME = new HyEnumDataType(4, "Time");



    // ... 其他枚举成员

    public static readonly values: HyEnumDataType[] = [
        HyEnumDataType.UNKNOWN,
        HyEnumDataType.THEME,
        HyEnumDataType.MAPDEVICE,
        HyEnumDataType.PROJECT,
        HyEnumDataType.TIME,

        // ... 添加所有枚举实例到数组
    ];

    private readonly type: number;
    private readonly name: string;

    private constructor(type: number, name: string) {
        this.type = type;
        this.name = name;
    }

    public getType(): number {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public static getByName(name: string): HyEnumDataType {
        for (const value of HyEnumDataType.values) {
            if (value.getName() === name) {
                return value;
            }
        }
        return HyEnumDataType.UNKNOWN;
    }

    public static getByIndex(type: number): HyEnumDataType {
        for (const value of HyEnumDataType.values) {
            if (value.getType() === type) {
                return value;
            }
        }
        return HyEnumDataType.UNKNOWN;
    }

    public static getTypeName(type: number): string {
        const enumInstance = HyEnumDataType.getByIndex(type);
        return enumInstance ? enumInstance.getName() : HyEnumDataType.UNKNOWN.getName();
    }
}