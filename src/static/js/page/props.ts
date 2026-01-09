import { PermissionType } from "./permission"
export interface configData {
    operateTypes: PermissionType[];
    [key: string]: any;
}
export interface ComponentPropsType {
    configData?: configData;
    configType?: number | string
}