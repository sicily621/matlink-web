import { IHySubjectManager } from "@static/components/observer/IHySubjectManager";
import { HyTopicManager } from "@static/components/observer/HyTopicManager";
import HyWebsocket from "@static/components/websocket/HyWebSocket"
import { LoginLocalStorage } from "@static/js/localStorage/key";
import { IHySubscribeHeader, IUser, ITenant, HyGlobalPermission, LoginInfo } from "@static/components/websocket/HySubscribeHeader";
import { getItem, setItem, removeItem } from "@static/js/common/utils";
import { AllPermissions } from '@static/js/page/permission'
import { AppConfig, AdminAppConfig } from "@static/js/configs/AppConfig";

export class HyGlobal {
    private static instance: HyGlobal;
    private userInfo: IUser | null = null;
    private token: string;
    private permission: HyGlobalPermission;
    private product: string;
    private productId: number;
    private groupId: string[];
    private userIds: number[] = [];
    private functionPermissionId: string | number = "";

    private topicManager!: HyTopicManager;
    private subjectManager!: IHySubjectManager;
    private socketClient!: HyWebsocket;

    private currentTenant: ITenant | null = null;
    private currentProject: ITenant | null = null;
    private selectedProject: ITenant | null = null;
    private loginInfo: LoginInfo | null = null;
    private projectInfo: any = null;
    private enterpriseInfo: any = null;
    private tenantInfo: any = null;
    private operatePermissionIds: number[] = [];

    constructor(config?: AppConfig) {
        const completePermission: IHySubscribeHeader = getItem(LoginLocalStorage.permission, false);
        const { tenants, user } = completePermission;
        this.permission = new HyGlobalPermission(tenants || []);
        this.userInfo = getItem(LoginLocalStorage.UserInfo) || user;
        this.token = getItem(LoginLocalStorage.Token, false) || "";
        this.product = config?.ProductCode || getItem(LoginLocalStorage.product, false) || AdminAppConfig.ProductCode;
        this.productId = config?.ProductId || getItem(LoginLocalStorage.productId, false) || AdminAppConfig.ProductId;
        const groupId = getItem(LoginLocalStorage.groupId, false)
        this.groupId = groupId ? groupId.split(",") : [];
        let tenant = null;
        const tenantId = getItem(LoginLocalStorage.currentTenant, false);
        const projectId = getItem(LoginLocalStorage.currentProject, false);
        const selectedProjectId = getItem(LoginLocalStorage.selectedProject, false);
        this.currentTenant = tenantId ? (tenant = JSON.parse(JSON.stringify(this.permission.getTenant(tenantId)))) : null
        if (projectId) {
            if (Array.isArray(projectId)) {
                tenant.projects = this.permission.getProjects(tenantId, projectId)
            } else {
                const project = this.permission.getProject(tenantId, projectId);
                tenant.projects = [project]
            }
        }
        if (selectedProjectId) {
            const selectedTenant = JSON.parse(JSON.stringify(tenant));
            const project = this.permission.getProject(tenantId, selectedProjectId);
            selectedTenant.projects = [project]
            this.selectedProject = selectedTenant;
        }
        this.currentProject = tenant;
        this.loginInfo = getItem(LoginLocalStorage.loginInfo, false) || null;
        this.projectInfo = getItem(LoginLocalStorage.projectInfo, false) || null;
        this.enterpriseInfo = getItem(LoginLocalStorage.enterpriseInfo, false) || null;
        this.operatePermissionIds = AllPermissions;
    }

    public static getInstance(config?: AppConfig): HyGlobal {
        if (!HyGlobal.instance) {
            const instance = new HyGlobal(config);
            HyGlobal.instance = instance;
            instance.socketClient = HyWebsocket.getInstance()
            instance.topicManager = HyTopicManager.getInstance();
            instance.subjectManager = IHySubjectManager.getInstance();
        }
        return HyGlobal.instance;
    }

    public getProduct(): string {
        return HyGlobal.instance.product;
    }

    public setProduct(product: string) {
        if (!product) return;
        HyGlobal.instance.product = product;
        if (product.length) {
            setItem(LoginLocalStorage.product, product, false)
        } else {
            removeItem(LoginLocalStorage.product, false)
        }
    }

    public getUserInfo(): IUser | null {
        const user = getItem(LoginLocalStorage.UserInfo);
        return user ?? HyGlobal.instance.userInfo;
    }

    public setUserInfo(info: IUser | null) {
        if (!HyGlobal.instance) return;
        HyGlobal.instance.userInfo = info;
        if (info) {
            setItem(LoginLocalStorage.UserInfo, info)
        } else {
            removeItem(LoginLocalStorage.UserInfo)
        }
    }

    public getToken(): string {
        return HyGlobal.instance.token;
    }

    public setToken(token: string) {
        if (token) {
            setItem(LoginLocalStorage.Token, token, false)
        } else {
            removeItem(LoginLocalStorage.Token, false)
        }
        if (!token || !HyGlobal.instance || token === HyGlobal.instance.token) return;
        HyGlobal.instance.token = token;
        HyWebsocket.getInstance().setToken(token);
        HyWebsocket.getInstance().reconnect();
    }

    public getSubjectManager(): IHySubjectManager {
        return HyGlobal.instance.subjectManager
    }

    public getTopicManager(): HyTopicManager {
        return HyGlobal.instance.topicManager
    }

    public getSocketClient(): HyWebsocket {
        return HyGlobal.instance.socketClient;
    }

    public getPermission(): HyGlobalPermission {
        return HyGlobal.instance.permission;
    }

    public setPermission(tenants: ITenant[]) {
        if (!tenants) return
        HyGlobal.instance.permission = new HyGlobalPermission(tenants);
    }

    public getCurrentTenant(): ITenant | null {
        return HyGlobal.instance.currentTenant;
    }

    public setCurrentTenant(tenantId: number | null) {
        const tenant = tenantId ? JSON.parse(JSON.stringify(HyGlobal.instance.permission?.getTenant(tenantId))) : null;
        HyGlobal.instance.currentTenant = tenant;
        if (tenant) {
            setItem(LoginLocalStorage.currentTenant, tenantId, false)
        } else {
            removeItem(LoginLocalStorage.currentTenant, false)
        }
    }

    public getCurrentProject(): ITenant | null {
        return HyGlobal.instance.currentProject;
    }
    public getSelectedProject(): ITenant | null {
        return HyGlobal.instance.selectedProject;
    }

    public setCurrentProject(projectId: number | null | number[]) {
        const tenant = projectId ? JSON.parse(JSON.stringify(HyGlobal.instance.currentTenant)) : null;
        if (tenant && projectId) {
            if (Array.isArray(projectId)) {
                const projects = HyGlobal.instance.permission.getProjects(tenant.tenantId, projectId);
                projects && (tenant.projects = projects)
            } else {
                const project = HyGlobal.instance.permission.getProject(tenant.tenantId, projectId);
                project && (tenant.projects = [project])
            }
        }
        HyGlobal.instance.currentProject = tenant;
        if (tenant) {
            setItem(LoginLocalStorage.currentProject, projectId, false)
        } else {
            removeItem(LoginLocalStorage.currentProject, false)
        }

    }
    public setSelectedProject(projectId: number | null) {
        const tenant = projectId ? JSON.parse(JSON.stringify(HyGlobal.instance.currentTenant)) : null;
        if (tenant && projectId) {
            const project = HyGlobal.instance.permission.getProject(tenant.tenantId, projectId);
            project && (tenant.projects = [project])
        }
        HyGlobal.instance.selectedProject = tenant;
        if (tenant) {
            setItem(LoginLocalStorage.selectedProject, projectId, false)
        } else {
            removeItem(LoginLocalStorage.selectedProject, false)
        }
    }

    public getLoginInfo(): LoginInfo | null {
        return HyGlobal.instance.loginInfo;
    }

    public setLoginInfo(loginInfo: LoginInfo | null) {
        HyGlobal.instance.loginInfo = loginInfo;
        if (loginInfo) {
            setItem(LoginLocalStorage.loginInfo, loginInfo, false)
        } else {
            removeItem(LoginLocalStorage.loginInfo, false)
        }
    }

    public getProjectInfo(): any | null {
        return HyGlobal.instance.projectInfo;
    }

    public setProjectInfo(projectInfo: any) {
        HyGlobal.instance.projectInfo = projectInfo;
        if (projectInfo) {
            setItem(LoginLocalStorage.projectInfo, projectInfo, false);
        } else {
            removeItem(LoginLocalStorage.projectInfo, false);
        }
    }

    public getTenantInfo(): any | null {
        return HyGlobal.instance.tenantInfo;
    }

    public setTenantInfo(tenantInfo: any) {
        HyGlobal.instance.tenantInfo = tenantInfo;
        if (tenantInfo) {
            setItem(LoginLocalStorage.tenantInfo, tenantInfo, false);
        } else {
            removeItem(LoginLocalStorage.tenantInfo, false);
        }
    }

    public getEnterpriseInfo(): any | null {
        return HyGlobal.instance.enterpriseInfo;
    }

    public setEnterpriseInfo(enterpriseInfo: any) {
        HyGlobal.instance.enterpriseInfo = enterpriseInfo;
        if (enterpriseInfo) {
            setItem(LoginLocalStorage.enterpriseInfo, enterpriseInfo, false);
        } else {
            removeItem(LoginLocalStorage.enterpriseInfo, false);
        }
    }

    public getFunctionPermissionId(): any | null {
        return HyGlobal.instance.functionPermissionId;
    }

    public setFunctionPermissionId(functionPermissionId: number) {
        HyGlobal.instance.functionPermissionId = functionPermissionId;
        if (functionPermissionId) {
            setItem(LoginLocalStorage.functionPermissionId, functionPermissionId, false);
        } else {
            removeItem(LoginLocalStorage.functionPermissionId, false);
        }
    }

    public getOperatePermissionIds(): number[] {
        return HyGlobal.instance.operatePermissionIds;
    }

    public setOperatePermissionIds(permissionIds: number[]) {
        HyGlobal.instance.operatePermissionIds = permissionIds;
    }

    public getProductId(): number {
        return HyGlobal.instance.productId;
    }

    public setProductId(productId: number) {
        HyGlobal.instance.productId = productId;
        if (productId) {
            setItem(LoginLocalStorage.productId, productId, false)
        } else {
            removeItem(LoginLocalStorage.productId, false)
        }
    }

    public getAllGroupId(): string[] {
        return HyGlobal.instance.groupId;
    }

    public getCurrentGroupId(): string {
        const len = HyGlobal.instance.groupId.length;
        const groupId = HyGlobal.instance.groupId?.[len - 1] || ""
        return groupId
    }

    public setGroupId(groupId: string) {
        if (!groupId) return;
        const index = HyGlobal.instance.groupId.findIndex(item => item === groupId)
        if (index === -1) {
            HyGlobal.instance.groupId.push(groupId)
        } else {
            HyGlobal.instance.groupId.splice(index + 1)
        }
        if (HyGlobal.instance.groupId.length > 0) {
            const groupIds = HyGlobal.instance.groupId.join(',')
            setItem(LoginLocalStorage.groupId, groupIds, false)
        } else {
            removeItem(LoginLocalStorage.groupId, false)
        }
    }

    public clearGroupId() {
        HyGlobal.instance.groupId = []
        removeItem(LoginLocalStorage.groupId, false)
    }

    public getUserIds(): number[] {
        return HyGlobal.instance.userIds;
    }

    public setUserIds(userIds: number[]) {
        HyGlobal.instance.userIds = userIds;
    }
}

