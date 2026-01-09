export enum PermissionType {
    Read = 1,  //查看
    Create = 2,  //新建
    Update = 3,  //编辑
    Delete = 4,  //删除
    Import = 5,  //导入
    Export = 6  //导出
}

//默认全权限
export const AllPermissions: PermissionType[] = [
    PermissionType.Read,
    PermissionType.Create,
    PermissionType.Update,
    PermissionType.Delete,
    PermissionType.Import,
    PermissionType.Export
]
/**
 * 判断是否有权限类型
 * @param permission 权限类型
 * @param pagePermissions 页面权限
 * @returns 
 */
export const hasPermission = (permission: PermissionType, pagePermissions: PermissionType[]) => {
    return pagePermissions.includes(permission);
}

/**
 * 计算页面权限数量，用于计算表格操作列宽度
 * @param permissions 表格操作列权限列表
 * @param pagePermissions 页面权限
 * @returns 
 */
export const getPermissionCount = (permissions: PermissionType[], pagePermissions: PermissionType[]) => {
    return permissions.reduce((count, permission) => count + (pagePermissions.includes(permission) ? 1 : 0), 0)
}