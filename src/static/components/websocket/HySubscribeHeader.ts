enum SUBSCRIBE_TYPE {
  DATA,
  EVENT,
  TAGDATA,
}

interface IUser {
  phone?: any;
  userId: number;
  userName: string;
  mainEnterpriseId?: number;
  selfEnterpriseId?: number;
  departmentId?: number;
  faceImg?: string
  password?: string
  sameRoleUserIds?: number[]
}

class User implements IUser {
  constructor(public userId: number,
    public userName: string,
    public mainEnterpriseId?: number,
    public selfEnterpriseId?: number,
    public departmentId?: number,
    public faceImg?: string,
    public sameRoleUserIds?: number[]
  ) {

  }
}

interface IDevice {
  deviceId: number;
  tags?: number[];
}

class Device implements IDevice {
  constructor(public deviceId: number, public tags: number[]) {

  }
}

interface IBuilding {
  buildingId: number;
  floors?: number[];
}

class Building implements IBuilding {
  constructor(public buildingId: number, public floors: number[]) {

  }
}

interface IPark {
  parkId: number;
  buildings?: IBuilding[];
}

class Park implements IPark {
  constructor(public parkId: number, public buildings: Building[]) {

  }
}
interface IProject {
  projectId: number;
  active?: boolean;
  parks?: IPark[];
  system?: number[];
  devices?: IDevice[];
}

interface IotHeader {
  ioMasterIds?: number[];
  ioServerIds?: number[];
  adapters?: IAdapter[];
  drivers?: IDriver[];
  devices?: IDevice[];
  projectId?:number
}

interface IAdapter {
  ioServerId: number;
  adapterGuid: number
}
interface IDriver {
  ioServerId: number;
  driverGuid: number;
}

class Project implements IProject {

  constructor(
    public projectId: number,
    public parks: Park[],
    public system: number[],
    public devices: Device[]
  ) {

  }
}
interface ITenant {
  tenantId: number;
  active?: boolean;
  projects?: IProject[];
}

class Tenant implements ITenant {

  constructor(public tenantId: number, public projects: Project[]) {

  }
}


class HyGlobalPermission {

  constructor(private tenants: ITenant[]) {

  }

  getTenants(): ITenant[] {
    return this.tenants || [];
  }

  getTenant(tenantId: number): ITenant | null {
    if (this.tenants && this.tenants.length > 0) {
      return (
        this.tenants.find((tenant) => tenant.tenantId === tenantId) || null
      );
    }
    return null;
  }

  hasTenant(tenantId: number): boolean {
    return !!this.getTenant(tenantId);
  }

  getProject(tenantId: number, projectId: number): IProject | null {
    const tenant = this.getTenant(tenantId);
    if (tenant && tenant.projects && tenant.projects.length > 0) {
      return (
        tenant.projects.find((project) => project.projectId === projectId) ||
        null
      );
    }
    return null;
  }

  getProjects(tenantId: number, projectIds: number[]): IProject[] {
    const tenant = this.getTenant(tenantId);
    if (tenant && tenant.projects && tenant.projects.length > 0) {
      return (
        tenant.projects.filter((project) => projectIds.includes(project.projectId)) ||
        []
      );
    }
    return [];
  }

  hasProject(tenantId: number, projectId: number): boolean {
    return !!this.getProject(tenantId, projectId);
  }

  hasSystem(tenantId: number, projectId: number, systemId: number): boolean {
    const project = this.getProject(tenantId, projectId);
    if (project && project.system && project.system.length > 0) {
      return project.system.includes(systemId);
    }
    return false;
  }

  hasDevice(tenantId: number, projectId: number, deviceId: number): IDevice | null {
    const project = this.getProject(tenantId, projectId);
    if (project && project.devices && project.devices.length > 0) {
      return project.devices.find((device) => device.deviceId === deviceId) || null;
    }
    return null;
  }

  hasTag(tenantId: number, projectId: number, deviceId: number, tagId: number): boolean {
    const device = this.hasDevice(tenantId, projectId, deviceId);
    if (device && device.tags && device.tags.length > 0) {
      return device.tags.includes(tagId)
    }
    return false;
  }

  getPark(tenantId: number, projectId: number, parkId: number): IPark | null {
    const project = this.getProject(tenantId, projectId);
    if (project && project.parks && project.parks.length > 0) {
      return project.parks.find((park) => park.parkId === parkId) || null;
    }
    return null;
  }

  hasPark(tenantId: number, projectId: number, parkId: number): boolean {
    return !!this.getPark(tenantId, projectId, parkId);
  }

  getBuilding(
    tenantId: number,
    projectId: number,
    parkId: number,
    buildingId: number
  ): IBuilding | null {
    const park = this.getPark(tenantId, projectId, parkId);
    if (park && park.buildings && park.buildings.length > 0) {
      return (
        park.buildings.find((building) => building.buildingId === buildingId) ||
        null
      );
    }
    return null;
  }

  hasBuilding(
    tenantId: number,
    projectId: number,
    parkId: number,
    buildingId: number
  ): boolean {
    return !!this.getBuilding(tenantId, projectId, parkId, buildingId);
  }

  hasFloor(
    tenantId: number,
    projectId: number,
    parkId: number,
    buildingId: number,
    floorId: number
  ): boolean {
    const building = this.getBuilding(tenantId, projectId, parkId, buildingId);
    if (building && building.floors && building.floors.length > 0) {
      return building.floors.includes(floorId);
    }
    return false;
  }
}

//完整参数类型
interface IHySubscribeHeader extends IotHeader {
  token: string
  user: IUser
  tenants?: ITenant[]
}

//订阅参数类型
type HySubscribeParam = ITenant[] | IProject[] | IDevice[] | IotHeader 

class HySubscribeHeader implements IHySubscribeHeader {
  public token: string;
  public user: IUser
  public tenants: ITenant[]
  constructor(private param: HySubscribeParam) {
    this.token = window.$HyGlobal.getToken();
    this.user = window.$HyGlobal.getUserInfo() as User;
    this.tenants = []
  }
  getParam(): IHySubscribeHeader {
    const userPermission = JSON.parse(JSON.stringify(window.$HyGlobal.getPermission().getTenants()));
    const user = JSON.parse(JSON.stringify(this.user));
    delete user.password;
    let filterParam: IHySubscribeHeader = {
      token: this.token,
      user: user,
    }
    // admin 项目就不处理参数了
    if (window.$HyGlobal.getProduct() === "admin") {
      filterParam.tenants = userPermission;
      return filterParam;
    }
    if (Array.isArray(this.param)) {
      if (this.param.length > 0) {
        if ('projectId' in this.param[0]) {
          // 项目
          this.tenants = filterMatchingPermissions(userPermission, this.param, "project")
        } else if ('tenantId' in this.param[0]) {
          //租户
          this.tenants = filterMatchingPermissions(userPermission, this.param, "tenant")
        }
        //Todo 设备的 
      } else {
        this.tenants = userPermission;
      }
      filterParam.tenants = this.tenants;
    }
    //页面自定义iot参数
    if (typeof this.param === 'object' && this.param !== null) {
      filterParam = { ...filterParam, ...this.param }
    }
    return filterParam;
  }

}


function filterMatchingPermissions(array1: any[], array2: any, prop: string, res?: any[]): any {
  // 遍历数组中的每个元素 
  for (const item of array1.concat()) {
    // 如果当前元素是对象并且包含属性  
    if (typeof item === 'object' && `${prop}Id` in item) {
      // 检查projectId是否匹配  
      const index = array2.findIndex((param: any) => item[`${prop}Id`] === param[`${prop}Id`])
      if (index > -1) {
        if (res) res.push(Object.assign(item, array2[index]))
      }
    }
    // 如果当前元素是对象并且包含属性
    if (typeof item === 'object' && Array.isArray(item[`${prop}s`])) {
      // 递归查找projects数组  
      const foundNode = filterMatchingPermissions(item[`${prop}s`], array2, prop, []);
      // 如果在数组中找到匹配的节点，返回该节点  
      if (foundNode) {
        item[`${prop}s`] = foundNode
        return item;
      }
    }
  }
  return res;
}

interface LoginInfo {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}
export { User, Device, Park, Building, Tenant, Project, HySubscribeHeader, SUBSCRIBE_TYPE, HyGlobalPermission };
export type { ITenant, IAdapter, IDriver, IDevice, IUser, IHySubscribeHeader, HySubscribeParam, LoginInfo }