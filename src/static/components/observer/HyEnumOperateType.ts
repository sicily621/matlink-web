
export default class HyEnumOperateType {
    public static UNKNOWN = new HyEnumOperateType(-1, "Unknown");
    public static ADD = new HyEnumOperateType(1, "observer.operateType.create");
    public static UPDATE = new HyEnumOperateType(2, "observer.operateType.edit");
    public static DELETE = new HyEnumOperateType(3, "observer.operateType.delete");
    public static IMPORT = new HyEnumOperateType(4, "observer.operateType.import");
    public static UPLOAD = new HyEnumOperateType(5, "observer.operateType.upload");
    public static EXECUTE = new HyEnumOperateType(7, "observer.operateType.export");
    public static DOWNLOAD = new HyEnumOperateType(8, "observer.operateType.download");

    public static readonly values: HyEnumOperateType[] = [
        HyEnumOperateType.UNKNOWN,
        HyEnumOperateType.ADD,
        HyEnumOperateType.UPDATE,
        HyEnumOperateType.DELETE,
        HyEnumOperateType.IMPORT,
        HyEnumOperateType.UPLOAD,
        HyEnumOperateType.EXECUTE,
        HyEnumOperateType.DOWNLOAD,
    ]


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

    public static getByName(name: string): HyEnumOperateType {
        for (const value of HyEnumOperateType.values) {
            if (value.getName() === name) {
                return value;
            }
        }
        return HyEnumOperateType.UNKNOWN;
    }

    public static getByIndex(type: number): HyEnumOperateType {
        for (const value of HyEnumOperateType.values) {
            if (value.getType() === type) {
                return value;
            }
        }
        return HyEnumOperateType.UNKNOWN;
    }

    public static getTypeName(type: number): string {
        const enumInstance = HyEnumOperateType.getByIndex(type);
        return enumInstance ? enumInstance.getName() : HyEnumOperateType.UNKNOWN.getName();
    }

}