<template>
  <div class="com-header-con flex-j-between">
    <img :src="blackLeftDecoration" class="header-decoration left black" />
    <img :src="blackRightDecoration" class="header-decoration right black" />
    <img :src="whiteLeftDecoration" class="header-decoration left white" />
    <img :src="whiteRightDecoration" class="header-decoration right white" />
    <div class="logo-name flex-center">
      <div class="logo-con">
        <img :src="headerInfo.logo" alt="" />
      </div>
      <el-text class="name m-l-10" v-if="layoutTheme === LayoutV.Vertical">{{ headerInfo.name }}</el-text>
    </div>
    <Message v-if="layoutTheme === LayoutV.Vertical" />
    <div v-if="layoutTheme === LayoutV.Horizontal" class="m-l-20 overflow-hidden top-menu-wrap">
      <ZcElMenu />
    </div>
    <div class="flex-1 m-l-20" v-show="layoutTheme === LayoutV.Vertical" id="topInfo"></div>
    <div class="flex-center p-r-20 right-wrap">
      <div class="date-userinfo-logout flex-center">
        <div class="date m-r-20" v-if="layoutTheme === LayoutV.Vertical">{{ dateData }}</div>
        <Notice />
        <div class="split-line m-r-20"></div>
        <div class="locale-switch m-r-20" @click="switchLang()">
          <img v-if="ZcLocalesV.cn === lang" :width="18" :height="18" :src="localeZhcn" />
          <img v-if="ZcLocalesV.en === lang" :width="18" :height="18" :src="localeEn" />
        </div>
        <div class="split-line m-r-20"></div>
        <el-dropdown>
          <div class="user-info flex-center">
            <div class="avatar">
              <img :src="headerInfo.userFaceImg" alt="" />
            </div>
            <div class="user-name">{{ headerInfo.userName }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div>
                  <div class="d-flex align-items-center" @click="personalInfo()">
                    <ThemeImg class="m-r-10" :width="14" :height="14" :src="personalInfoIcon" />
                    {{ i18nM("header.personalInfo") }}
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div>
                  <div class="d-flex align-items-center" @click="resetPwd()">
                    <ThemeImg class="m-r-10" :width="14" :height="14" :src="resetPwdIcon" />
                    {{ i18nM("header.modifyPassword") }}
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="SmartAppConfig.HTMLID == htmlID && !ThirdConfig">
                <div>
                  <div class="d-flex align-items-center" @click="switchUser()">
                    <ThemeImg class="m-r-10" :width="14" :height="14" :src="resetPwdIcon" />
                    {{ i18nM("header.switchUser") }}
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="SmartAppConfig.HTMLID == htmlID && !ThirdConfig">
                <div>
                  <div class="d-flex align-items-center" @click="openScheduling()">
                    <ThemeImg class="m-r-10" :width="14" :height="14" :src="resetPwdIcon" />
                    {{ i18nM("header.shiftHandover") }}
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="split-line m-r-20"></div>
      <img :width="16" :src="themeColorIcon" class="m-r-10 pointer" @click="toggleThemeDrawerVisible" />
      <div class="set-btn">
        <zElDrawer />
      </div>
      <div v-if="groupConfigHtmlIds.includes(htmlID)" class="send-group-con" @click="logout_()">
        <img :src="logoutIcon" alt="" />
      </div>
      <template v-if="!groupConfigHtmlIds.includes(htmlID)">
        <div v-if="!groupId" class="send-group-con" @click="logout_()">
          <img :src="logoutIcon" alt="" />
        </div>
        <div v-if="groupId" class="send-group-con" @click="sendGroup">
          <img :src="sendGroupSvg" />
        </div>
      </template>
    </div>
    <zModel
      ref="resetPwdZModelRef"
      :style="{ width: zrem(520), paddingBottom: zrem(20) }"
      :custom-model-title="i18nM('header.modifyPassword')"
      @confirm="confirmResetPwd"
    >
      <el-form label-position="right" label-width="90px" :model="resetPwdModelForm" :rules="resetPwdRules" ref="resetPwdModelFormRef">
        <el-form-item :label="i18nM('header.username')" required>
          <el-input class="w-320" v-model="headerInfo.userName" readonly></el-input>
        </el-form-item>
        <el-form-item :label="i18nM('header.originalPassword')" required prop="oldPwd">
          <el-input type="password" :placeholder="i18nM('header.pleaseEnterPassword')" class="w-320" v-model="resetPwdModelForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item :label="i18nM('header.password')" required prop="pwd">
          <el-input type="password" :placeholder="i18nM('header.pleaseEnterPassword')" class="w-320" v-model="resetPwdModelForm.pwd"></el-input>
        </el-form-item>
        <el-form-item :label="i18nM('header.confirmPassword')" required prop="confirmPwd">
          <el-input
            type="password"
            :placeholder="i18nM('header.pleaseConfirmPassword')"
            class="w-320"
            v-model="resetPwdModelForm.confirmPwd"
          ></el-input>
        </el-form-item>
      </el-form>
    </zModel>
    <zModel
      ref="loginModelRef"
      :style="{ width: zrem(480), paddingBottom: zrem(20) }"
      :custom-model-title="i18nM('header.switchUser')"
      @confirm="confirmSwitchUser"
    >
      <el-form label-position="right" label-width="90px" :model="loginModelForm" :rules="loginRules" ref="loginModelFormRef">
        <el-form-item :label="i18nM('header.username')" required prop="username">
          <el-input class="w-320" v-model="loginModelForm.username" :placeholder="i18nM('header.pleaseEnterUsername')"></el-input>
        </el-form-item>
        <el-form-item :label="i18nM('header.password')" required prop="password">
          <el-input type="password" :placeholder="i18nM('header.pleaseEnterPassword')" class="w-320" v-model="loginModelForm.password"></el-input>
        </el-form-item>
      </el-form>
    </zModel>
    <zModel
      ref="personalInfoZModelRef"
      :style="{ width: zrem(720), paddingBottom: zrem(20) }"
      :custom-model-title="i18nM('header.personalInfo')"
      @confirm="confirmPersonalInfo()"
    >
      <el-form
        ref="personalInfoZModelFormRef"
        :model="personalInfoZModelForm"
        :rules="personalInfoZModelRules"
        class="d-flex m-t-20 m-l-20"
        label-position="top"
        label-width="120px"
      >
        <div>
          <el-form-item class="face-wrap" :label="i18nM('header.avatar')" prop="logo">
            <Upload
              @fileChange="avatarChange($event)"
              :imgPath="personalInfoZModelForm.faceImg"
              :imgStyle="{ width: zrem(40), height: zrem(40) }"
              :accept="UploadType.commonImg"
            ></Upload>
          </el-form-item>
          <el-form-item class="from_item" required :label="i18nM('header.username')" prop="userName" col-span="2">
            <el-input
              v-model="personalInfoZModelForm.userName"
              maxlength="32"
              required
              class="ipt"
              :placeholder="i18nM('header.pleaseEnterUsername')"
              readonly
            >
            </el-input>
          </el-form-item>
          <el-form-item class="from_item" :label="i18nM('header.name')" prop="name" required>
            <el-input v-model="personalInfoZModelForm.name" maxlength="32" required class="ipt" :placeholder="i18nM('header.pleaseEnterName')">
            </el-input>
          </el-form-item>
          <el-form-item class="from_item" required :label="i18nM('header.code')" prop="userCode">
            <el-input v-model="personalInfoZModelForm.userCode" required class="ipt" :placeholder="i18nM('header.pleaseEnterCode')"> </el-input>
          </el-form-item>
        </div>
        <div class="m-l-20">
          <el-form-item class="from_item" required :label="i18nM('header.phone')" prop="phone">
            <el-input v-model="personalInfoZModelForm.phone" required class="ipt" :placeholder="i18nM('header.pleaseEnterPhone')"> </el-input>
          </el-form-item>
          <el-form-item class="from_item" :label="i18nM('header.idCard')" prop="identification" col-span="2">
            <el-input v-model="personalInfoZModelForm.identification" class="ipt" :placeholder="i18nM('header.pleaseEnterIdCard')"> </el-input>
          </el-form-item>
          <el-form-item class="from_item" required :label="i18nM('header.email')" prop="email">
            <el-input v-model="personalInfoZModelForm.email" required class="ipt" :placeholder="i18nM('header.pleaseEnterEmail')"> </el-input>
          </el-form-item>
        </div>
      </el-form>
    </zModel>
    <zModel ref="schedulingModelRef" :style="{ width: zrem(670), paddingBottom: zrem(20) }" :custom-model-title="''" :noConfirmBtnFlag="true">
      <div>
        <div>
          <el-tabs v-model="schedulingModelForm.tabFlag">
            <el-tab-pane :label="i18nM('header.dutyRecord')" :name="0"></el-tab-pane>
            <el-tab-pane :label="i18nM('header.handoverRecord')" :name="1"></el-tab-pane>
          </el-tabs>
        </div>
        <template v-if="!schedulingModelForm.tabFlag">
          <div class="d-flex align-items-center m-b-20">
            <div class="scheduling-item">
              <div class="scheduling-title-word">{{ i18nM("header.dutySituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverContet"
                  :placeholder="i18nM('header.pleaseEnterDutySituation')"
                  type="textarea"
                  :rows="4"
                  :readonly="schedulingModelForm.alredyScheduling"
                ></el-input>
              </div>
            </div>
            <div class="scheduling-item m-l-30">
              <div class="scheduling-title-word">{{ i18nM("header.hygieneSituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.hygieneCondition"
                  :placeholder="i18nM('header.pleaseEnterHygieneSituation')"
                  type="textarea"
                  :rows="4"
                  :readonly="schedulingModelForm.alredyScheduling"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center m-b-20">
            <div class="scheduling-item">
              <div class="scheduling-title-word">{{ i18nM("header.equipmentSituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.equipContent"
                  :placeholder="i18nM('header.pleaseEnterEquipmentSituation')"
                  type="textarea"
                  :rows="4"
                  :readonly="schedulingModelForm.alredyScheduling"
                ></el-input>
              </div>
            </div>
            <div class="scheduling-item m-l-30">
              <div class="scheduling-title-word">{{ i18nM("header.offDutyAttention") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverNote"
                  :placeholder="i18nM('header.pleaseEnterOffDutyAttention')"
                  type="textarea"
                  :rows="4"
                  :readonly="schedulingModelForm.alredyScheduling"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-end">
            <el-button type="primary" class="m-r-20" @click="confirmScheduling" :disabled="schedulingModelForm.alredyScheduling">{{
              i18nM("header.submit")
            }}</el-button>
            <el-button type="primary" class="m-r-20" @click="confirmHandover" :disabled="schedulingModelForm.alredyScheduling">{{
              i18nM("header.handover")
            }}</el-button>
          </div>
        </template>
        <template v-if="schedulingModelForm.tabFlag">
          <div class="d-flex align-items-center m-b-20">
            <div class="scheduling-item">
              <div class="scheduling-title-word">{{ i18nM("header.dutySituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverPersonObj.handoverContet"
                  :placeholder="i18nM('header.pleaseEnterDutySituation')"
                  type="textarea"
                  :rows="4"
                  readonly
                ></el-input>
              </div>
            </div>
            <div class="scheduling-item m-l-30">
              <div class="scheduling-title-word">{{ i18nM("header.hygieneSituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverPersonObj.hygieneCondition"
                  :placeholder="i18nM('header.pleaseEnterHygieneSituation')"
                  type="textarea"
                  :rows="4"
                  readonly
                ></el-input>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center m-b-20">
            <div class="scheduling-item">
              <div class="scheduling-title-word">{{ i18nM("header.equipmentSituation") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverPersonObj.equipContent"
                  :placeholder="i18nM('header.pleaseEnterEquipmentSituation')"
                  type="textarea"
                  :rows="4"
                  readonly
                ></el-input>
              </div>
            </div>
            <div class="scheduling-item m-l-30">
              <div class="scheduling-title-word">{{ i18nM("header.offDutyAttention") }}</div>
              <div class="scheduling-content">
                <el-input
                  class="scheduling-content-textarea"
                  v-model="schedulingModelForm.handoverPersonObj.handoverNote"
                  :placeholder="i18nM('header.pleaseEnterOffDutyAttention')"
                  type="textarea"
                  :rows="4"
                  readonly
                ></el-input>
              </div>
            </div>
          </div>
        </template>
      </div>
    </zModel>
    <el-drawer v-model="showThemeColor" custom-class="theme-color-drawer">
      <template #header>
        <h4>{{ i18nM("header.colorScheme") }}</h4>
      </template>
      <template #default>
        <ThemeColor />
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { Ref, ref, computed, watch, getCurrentInstance } from "vue";
import { type FormRules } from "element-plus";
import { LayoutV } from "@static/js/theme/types";
import useLocaleStore from "@static/js/store/locale";
import { i18n } from "@static/js/locales/index";
import { ZcLocalesV } from "@static/js/locales";
import ThemeImg from "@static/components/themeImg/themeImg.vue";
import Message from "../message/message.vue";
import zElDrawer from "../zElDrawer/zElDrawer.vue";
import Notice from "../notice/notice.vue";
import localeZhcn from "@/assets/images/locale-zhcn.png";
import localeEn from "@/assets/images/locale-en.png";
import useThemeStore from "@static/js/store/theme";
import ZcElMenu from "../zElMenu/zElMenu.vue";
import blackLeftDecoration from "@static/images/header-left-decoration-black.png";
import blackRightDecoration from "@static/images/header-right-decoration-black.png";
import whiteLeftDecoration from "@static/images/header-left-decoration-white.png";
import whiteRightDecoration from "@static/images/header-right-decoration-white.png";
import { xwfuPost, post, get, formDataPost } from "@static/js/http/http";
import { AdminAppConfig, SmartAppConfig, IotAppConfig, MopaiAppConfig, MasterAppConfig, MakeAppConfig } from "@static/js/configs/AppConfig";
import { htmlID } from "@static/js/common/id";
import zModel from "@static/components/zModel/zModel.vue";
import { RSAEncrypt } from "@static/js/common/crypto";
import { ElMessage } from "element-plus";
import resetPwdIcon from "@static/images/reset-pwd-icon.svg";
import logoutIcon from "@static/images/logout-icon.svg";
import themeColorIcon from "@static/images/theme-color.svg";
import personalInfoIcon from "@static/images/personal-info-icon.svg";
import { zrem } from "@static/js/theme/zrem";
import Upload from "@static/elementUI/upload/upload.vue";
import sendGroupSvg from "@static/images/send-group.svg";
import { ThirdConfig } from "@static/third/thirdInterface";
import useMenuStore from "@static/js/store/menu";
import { xwfuGet } from "@static/js/http/http";
import SwitchGroupIcon from "@static/images/switch-group-icon.svg";
import ThemeColor from "@static/components/color/color.vue";
import { useI18n } from "vue-i18n";
import { UploadType } from "../../js/common/enum";
import { trim } from "../../js/common/utils";
import { LoginLocalStorage } from "@static/js/localStorage/key";
import { setItem } from "@static/js/common/utils";
import { setAuthReleaseRoutes } from "@static/js/http/custom";
import { useMultiTagsStoreHook } from "@static/js/store/multiTags";
import defaultFace from "@static/images/defaultFace.png";
import defaultFace2 from "@static/images/defaultFace.svg";
const groupConfigHtmlIds = [SmartAppConfig.HTMLID, IotAppConfig.HTMLID, MopaiAppConfig.HTMLID, MasterAppConfig.HTMLID];
import axios from "axios";

const i18nM = window.$i18nM;
const headerInfo = ref<any>({});
const route = useRoute();
const { locale, t } = useI18n();
const instance = getCurrentInstance();
const groupId = ref<any>(route.query.groupId);
const resetPwdModelForm: any = ref({
  pwd: "",
  confirmPwd: "",
  oldPwd: "",
});
const loginModelForm: any = ref({
  username: "",
  password: "",
});
const schedulingModelForm = ref({
  id: null,
  planId: null,
  tabFlag: 0,
  handoverPersonId: null,
  takeoverPersonId: null,
  handoverContet: "",
  handoverNote: "",
  equipContent: "",
  hygieneCondition: "",
  preShiftId: null,
  alredyScheduling: false,
  handoverPersonObj: {
    handoverContet: "",
    handoverNote: "",
    equipContent: "",
    hygieneCondition: "",
  },
});
const schedulingModelFormHistory = ref<any>({});
const menuStore = useMenuStore();
const groupInfo = computed<any>(() => {
  return menuStore.getGroupInfo;
});
const showThemeColor = ref(false);
const toggleThemeDrawerVisible = () => {
  showThemeColor.value = !showThemeColor.value;
};
const frameGroupList = ref([]);
const largeScreeGroupList = ref([]);
const devGroupList = ref([]);
const router = useRouter();

const validateConfirmPassword = (_: any, value: any, callback: any) => {
  if (value !== resetPwdModelForm.value.pwd) {
    callback(new Error(i18nM("header.passwordMismatch")));
  } else {
    callback();
  }
};
const resetPwdRules: any = ref({
  pwd: [
    { required: true, message: i18nM("header.pleaseEnterPassword") },
    {
      pattern: /^\S*(?=\S{8,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/,
      message: i18nM("header.passwordFormatError"),
    },
  ],
  confirmPwd: [{ required: true, message: i18nM("header.pleaseConfirmPassword") }, { validator: validateConfirmPassword }],
  oldPwd: [{ required: true, message: i18nM("header.pleaseEnterOriginalPassword") }],
});
const loginRules: any = ref({
  username: [{ required: true, message: i18nM("header.pleaseEnterUsername") }],
  password: [
    { required: true, message: i18nM("header.pleaseEnterPassword") },
    {
      pattern: /^\S*(?=\S{8,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/,
      message: i18nM("header.passwordFormatError"),
    },
  ],
});
const getUserInfo = () => {
  const productId = window.$HyGlobal.getProductId(); //获取产品ID
  // 判断产品是否是hySmart(3)产品
  if (productId == 3) {
    if (!window.$HyGlobal.getProjectInfo()) {
      router.push({
        path: "/login",
      });
      return;
    }
    const projectId = window.$HyGlobal.getProjectInfo().id;
    get(`/service/center/common/tenant/api/projects/${projectId}`, null, (res: any) => {
      headerInfo.value = res.data || {};
      headerInfo.value.name = res.data.platformName;
      const userInfo = window.$HyGlobal.getUserInfo();
      if (userInfo) {
        headerInfo.value.userFaceImg = userInfo.faceImg?.indexOf("defaultFace") != -1 ? defaultFace : userInfo.faceImg;
        headerInfo.value.userName = userInfo.userName;
        headerInfo.value.userId = userInfo.userId;
      }
    });
  } else {
    post(
      `/service/center/common/user/main/api/enterprises/getMainEnterPrisesByCurUser`,
      {
        page: null,
        size: null,
      },
      (res: any) => {
        headerInfo.value = res.data.content[0] || {};
        const userInfo = window.$HyGlobal.getUserInfo();
        if (userInfo) {
          headerInfo.value.userFaceImg = userInfo.faceImg?.indexOf("defaultFace") != -1 ? defaultFace : userInfo.faceImg;
          headerInfo.value.userName = userInfo.userName;
          headerInfo.value.userId = userInfo.userId;
        }
      }
    );
  }
};

getUserInfo();
const sendGroup = () => {
  const arr = route.query.groupId;
  if (Array.isArray(arr) && arr.length === 2) {
    arr.pop();
    router.push({
      path: "/",
      query: {
        groupId: arr,
        timeStamp: Number(new Date().getTime()),
      },
    });
    window.$HyGlobal.setCurrentProject(null);
  } else {
    router.push("/");
    window.$HyGlobal.setCurrentTenant(null);
  }
};

const switchGroup = (obj: any) => {
  router.push({
    path: "/",
    query: {
      groupId: obj.id,
      timeStamp: Number(new Date().getTime()),
    },
  });
};

const closeAllTags = () => {
  useMultiTagsStoreHook().handleTags(
    "splice",
    "",
    {
      startIndex: 0,
      length: useMultiTagsStoreHook().multiTagsMap[groupId.value || "init"].length,
    },
    groupId.value || "init"
  );
};
const loginModelRef = ref();
const loginModelFormRef = ref();
const schedulingModelRef = ref();
const resetPwdZModelRef = ref();
const resetPwdModelFormRef = ref();
const personalInfoZModelRef = ref();
const personalInfoZModelFormRef = ref();
const personalInfoZModelForm = ref<any>({});
const personalInfoZModelRules = ref<FormRules>({
  userName: [{ required: true, message: i18nM("header.pleaseEnterUsername") }],
  name: [{ required: true, message: i18nM("header.pleaseEnterName") }],
  userCode: [{ required: true, message: i18nM("header.pleaseEnterCode") }],
  phone: [
    { required: true, message: i18nM("header.pleaseEnterPhone") },
    { pattern: /^1[3-9]\d{9}$/, message: i18nM("header.phoneFormatError") },
  ],
  email: [
    { required: true, message: i18nM("header.emailRequired"), trigger: "blur" },
    { type: "email", message: i18nM("header.emailFormatError"), trigger: "blur" },
  ],
});
const themeStore = useThemeStore();
const layoutTheme = computed(() => themeStore.getLayout); //获取当前布局

const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang); //获取语言
const dateData: Ref<string> = ref(""); //时间ui文字
const switchLang = () => {
  const value = i18n.global.locale.value === ZcLocalesV.cn ? ZcLocalesV.en : ZcLocalesV.cn;
  localStorage.setItem("lang", value);
  const localeStore = useLocaleStore();
  localeStore.setLang(value);
  locale.value = value;
  dateData.value = dateFormat() || "";
  const ztFunc = function (key: string) {
    let res = t(key);
    if (res.indexOf(".") == -1) {
      return res;
    }
    let arr = res.split(".");
    return arr[arr.length - 1];
  };
  window.$i18nM = ztFunc;
};

//清空缓存
const clearCache = () => {
  window.$HyGlobal.setToken("");
  window.$HyGlobal.setUserIds([]);
  window.$HyGlobal.setLoginInfo(null);
  window.$HyGlobal.setCurrentTenant(null);
  window.$HyGlobal.setCurrentProject(null);
  window.$HyGlobal.setSelectedProject(null);
  window.$HyGlobal.setPermission([]);
  window.$HyGlobal.clearGroupId();
  closeAllTags();
};
/**
 * 退出登录
 */
const logout_ = () => {
  if (AdminAppConfig.HTMLID === htmlID) {
    post("/admin/main/api/admin/logout", {}, () => {
      clearCache();
      router.push("/login");
    });
  }
  if (MakeAppConfig.HTMLID === htmlID) {
    post(`/make/main/api/oauth/logout`, {}, () => {
      clearCache();
      router.push("/login");
    });
  }
  if (SmartAppConfig.HTMLID === htmlID) {
    const factoryFlag = import.meta.env.VITE_APP_THIRD_CONFIG || null;
    console.log("factoryFlag", factoryFlag);
    if (factoryFlag == "guohui") {
      post(`/smart/main/api/oauth/logout`, {}, () => {
        clearCache();
        const routerUrl = `/_guohuiLoginOut/renzheng/oauth/loginOut`;
        const headers = {
          Authorization: "u-" + sessionStorage.getItem("otherToken"),
          "Content-Type": "application/json; charset=utf-8",
        };
        axios.post(routerUrl, {}, { headers: headers }).then((res: any) => {
          if (res.code == 200) {
            window.location.href = "https://ip.cncc2.com"; // 国会专用
          }
        });
      });
    } else {
      post(`/smart/main/api/oauth/logout`, {}, () => {
        clearCache();
        router.push("/login");
      });
    }
  }
  if (IotAppConfig.HTMLID === htmlID) {
    post(`/iot/main/api/oauth/logout`, {}, () => {
      clearCache();
      router.push("/login");
    });
  }
  if (MopaiAppConfig.HTMLID === htmlID) {
    post(`/mopai/main/api/oauth/logout`, {}, () => {
      clearCache();
      router.push("/login");
    });
  }
};
/**
 * 时间格式化
 */
const dateFormat = (): string | undefined => {
  var myDate = new Date();
  var Y = myDate.getFullYear(); //获取当前完整年份
  var M = myDate.getMonth() + 1; //获取当前月份
  var D = myDate.getDate(); //获取当前日1-31
  var Day = myDate.getDay();
  var H = myDate.getHours(); //获取当前小时
  var i = myDate.getMinutes(); //获取当前分钟
  var s = myDate.getSeconds();
  if (lang.value === ZcLocalesV.cn) {
    let dayArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${Y}年${M}月${D}日 ${H < 10 ? `0` + H : H}:${i < 10 ? `0${i}` : i}:${s < 10 ? `0${s}` : s} ${dayArr[Day]}`;
  }
  if (lang.value === ZcLocalesV.en) {
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let mArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${dayArr[Day]}, ${mArr[M]} ${D}, ${Y} ${H < 10 ? `0` + H : H}:${i < 10 ? `0` + i : i}:${s < 10 ? `0` + s : s}`;
  }
};

const personalInfo = () => {
  if (!headerInfo.value.userId) return;
  get(`/service/center/common/user/main/api/users/` + headerInfo.value.userId, null, (res: any) => {
    if (res.data.faceImg.indexOf("defaultFace") != -1) {
      res.data.faceImg = defaultFace2;
    }
    personalInfoZModelForm.value = res.data;
    personalInfoZModelRef.value.openCustomModel();
  });
};

const avatarChange = (file: File) => {
  personalInfoZModelForm.value.faceImgFile = file;
};

const resetPwd = () => {
  resetPwdModelForm.value = {
    pwd: "",
    confirmPwd: "",
    oldPwd: "",
  };
  resetPwdZModelRef.value.openCustomModel();
};
const confirmResetPwd = () => {
  resetPwdModelFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const getPublicKeyRouter = `/service/center/common/user/main/oauth2/getPublicKey`;
      setAuthReleaseRoutes(getPublicKeyRouter);
      xwfuGet(getPublicKeyRouter, null, (res: any) => {
        post(
          `/service/center/common/user/main/api/users/updatePwd`,
          {
            userId: headerInfo.value.userId,
            oldPwd: RSAEncrypt(trim(resetPwdModelForm.value.oldPwd), res.data),
            newPwd: RSAEncrypt(trim(resetPwdModelForm.value.pwd), res.data),
            factoryFlag: import.meta.env.VITE_APP_THIRD_CONFIG || null,
          },
          () => {
            resetPwdZModelRef.value.closeCustomModel();
            ElMessage({
              type: "success",
              message: "修改密码成功",
            });
          }
        );
      });
    }
  });
};
const switchUser = () => {
  loginModelForm.value = {
    username: "",
    password: "",
  };
  loginModelRef.value.openCustomModel();
};
const openScheduling = () => {
  xwfuPost(
    `/service/center/scheduling/api/schedulingShiftRecord/findRecord`,
    {
      projectId: window.$HyGlobal.getProjectInfo().id,
    },
    (res: any) => {
      if (res.data.currentRecord && res.data.currentRecord.id) {
        schedulingModelForm.value.handoverContet = res.data.currentRecord.handoverContet;
        schedulingModelForm.value.handoverNote = res.data.currentRecord.handoverNote;
        schedulingModelForm.value.equipContent = res.data.currentRecord.equipContent;
        schedulingModelForm.value.hygieneCondition = res.data.currentRecord.hygieneCondition;
        schedulingModelForm.value.id = res.data.currentRecord.id;
        schedulingModelForm.value.handoverPersonId = res.data.currentRecord.handoverPersonId;
        schedulingModelForm.value.preShiftId = res.data.currentRecord.preShiftId;
        schedulingModelForm.value.alredyScheduling = res.data.currentRecord.alredyScheduling;
      }
      if (res.data.lastRecord && res.data.lastRecord.id) {
        schedulingModelForm.value.handoverPersonObj = res.data.lastRecord;
      }
      schedulingModelRef.value.openCustomModel();
    }
  );
};
const confirmScheduling = () => {
  post(
    `/service/center/scheduling/api/schedulingShiftRecord/save`,
    {
      projectId: window.$HyGlobal.getProjectInfo().id,
      planId: 0,
      handoverPersonId: schedulingModelForm.value.handoverPersonId || 0,
      takeoverPersonId: window.$HyGlobal.getUserInfo()?.userId,
      handoverContet: schedulingModelForm.value.handoverContet,
      handoverNote: schedulingModelForm.value.handoverNote,
      equipContent: schedulingModelForm.value.equipContent,
      hygieneCondition: schedulingModelForm.value.hygieneCondition,
      preShiftId: schedulingModelForm.value.preShiftId || 0,
      shiftTime: new Date().getTime(),
      id: schedulingModelForm.value.id || null,
    },
    (res: any) => {
      if (!schedulingModelForm.value.id) schedulingModelForm.value.id = res.data.id;
    }
  );
};
const confirmHandover = () => {
  const preUser = JSON.stringify(window.$HyGlobal.getUserInfo());
  schedulingModelFormHistory.value = JSON.parse(JSON.stringify(schedulingModelForm.value));
  schedulingModelFormHistory.value.flag = true;
  console.log("查看用户信息和历史信息：", preUser, schedulingModelFormHistory.value);
  schedulingModelRef.value.closeCustomModel();
  switchUser();
};
const confirmSwitchUser = () => {
  const historyUserId = window.$HyGlobal.getUserInfo()?.userId;
  clearCache();
  const getPublicKeyRouter = `/service/center/common/user/main/oauth2/getPublicKey`;
  setAuthReleaseRoutes(getPublicKeyRouter);
  xwfuGet(getPublicKeyRouter, null, (res: any) => {
    const routerUrl = `/smart/main/api/oauth/login`;
    setAuthReleaseRoutes(routerUrl);
    post(
      routerUrl,
      {
        username: trim(loginModelForm.value.username),
        password: RSAEncrypt(trim(loginModelForm.value.password), res.data),
        productId: SmartAppConfig.ProductId,
        projectId: window.$HyGlobal.getProjectInfo().id,
      },
      (res: any) => {
        post(`/smart/main/api/oauth/logout`, {}, () => {
          const { authorities, subscribeHeader } = res.data;
          const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken } = authorities;
          const token: string = `Bearer ${accessToken}`;
          const { product, tenants, user, projectId } = subscribeHeader;
          const tenantId = tenants?.[0].tenantId;
          product && window.$HyGlobal.setProduct(product);
          window.$HyGlobal.setToken(token);
          window.$HyGlobal.setUserInfo(user);
          window.$HyGlobal.setPermission(tenants);
          window.$HyGlobal.setLoginInfo({ accessToken, expiresIn, refreshToken });
          tenantId && window.$HyGlobal.setCurrentTenant(tenantId);
          setItem(LoginLocalStorage.permission, subscribeHeader, false);
          getUserIds(projectId, () => {
            window.$HyGlobal.setCurrentProject(projectId);
            if (schedulingModelFormHistory.value.flag) {
              schedulingModelFormHistory.value.flag = false;
              post(
                `/service/center/scheduling/api/schedulingShiftRecord/save`,
                {
                  projectId: window.$HyGlobal.getProjectInfo().id,
                  planId: 0,
                  handoverPersonId: historyUserId,
                  takeoverPersonId: window.$HyGlobal.getUserInfo()!.userId,
                  handoverContet: schedulingModelFormHistory.value.handoverContet,
                  handoverNote: schedulingModelFormHistory.value.handoverNote,
                  equipContent: schedulingModelFormHistory.value.equipContent,
                  hygieneCondition: schedulingModelFormHistory.value.hygieneCondition,
                  preShiftId: schedulingModelFormHistory.value.id,
                  shiftTime: new Date().getTime(),
                  // id: schedulingModelForm.value.id || null
                },
                () => {
                  history.go(0);
                }
              );
            } else {
              history.go(0);
            }
          });
        });
      }
    );
  });
};

const getUserIds = (projectId: string, cb?: Function) => {
  if (!projectId) return;
  const routerUrl = `/smart/main/api/role/findUserIdsByRoleId`;
  xwfuGet(routerUrl, { projectId }, (res: any) => {
    const userIds = res.data;
    userIds?.length && window.$HyGlobal.setUserIds(userIds);
    cb && cb(res.data);
  });
};

const confirmPersonalInfo = () => {
  personalInfoZModelFormRef.value.validate((valid: boolean) => {
    if (valid) {
      personalInfoZModelForm.value.password = null;
      personalInfoZModelForm.value.registerTime = null;
      personalInfoZModelForm.value.startTime = new Date(personalInfoZModelForm.value.startTime).getTime();
      personalInfoZModelForm.value.endTime = new Date(personalInfoZModelForm.value.endTime).getTime();
      formDataPost("/service/center/common/user/main/api/users", personalInfoZModelForm.value, (res: any) => {
        get(`/service/center/common/user/main/api/users/` + headerInfo.value.userId, null, (res: any) => {
          let user: any = window.$HyGlobal.getUserInfo();
          user.faceImg = res.data.faceImg;
          user.userName = res.data.userName;
          window.$HyGlobal.setUserInfo(user);
          headerInfo.value.userFaceImg = res.data.faceImg?.indexOf("defaultFace") != -1 ? defaultFace : res.data.faceImg;
          headerInfo.value.userName = res.data.userName;
        });
        personalInfoZModelRef.value.closeCustomModel();
        ElMessage({
          type: "success",
          message: "个人资料编辑成功",
        });
      });
    }
  });
};

dateData.value = dateFormat() || "";
setInterval(() => {
  dateData.value = dateFormat() || "";
}, 1000);
watch(
  () => router.currentRoute.value,
  (nv) => {
    groupId.value = nv.query.groupId;
  }
);
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.top-menu-wrap {
  width: calc(100% - zrem(350)) !important;
}

.com-header-con {
  width: 100%;
  height: 100%;
  padding-left: zrem(10);
  box-sizing: border-box;
  cursor: default;
  user-select: none;

  .header-decoration {
    position: absolute;
    height: zrem(72);
    padding: 0;
    display: none;

    &.left {
      left: 0;
      top: 0;
    }

    &.right {
      right: 0;
      top: 0;
      width: zrem(497);
    }
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .logo-name {
    position: relative;

    .logo-con {
      // width: zrem(80);
      height: zrem(40);

      img {
        // width: 100%;
        height: 100%;
      }
    }

    .name {
      font-size: zrem(18);
    }
  }

  .right-wrap {
    position: relative;
  }

  @media screen and (max-width: 1200px) {
    .date-userinfo-logout {
      display: none;
    }
  }

  .date {
    font-size: zrem(14);
  }

  .user-info {
    .avatar {
      width: zrem(18);
      height: zrem(18);
      overflow: hidden;
      border-radius: 50%;
      margin-right: zrem(10);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-name {
      font-size: zrem(14);
      margin-right: zrem(14);
    }
  }

  .locale-switch {
    width: zrem(18);
    height: zrem(18);
    cursor: pointer;
    filter: blur("red");

    img {
      width: 100%;
      height: 100%;
    }
  }

  .full-screen {
    font-size: zrem(18);
    cursor: pointer;
  }

  .logout {
    font-size: zrem(18);
    cursor: pointer;
  }

  .set-btn {
    width: zrem(18);
    height: zrem(18);
    color: var(--el-text-color-primary);
  }

  .send-group-con {
    width: zrem(16);
    height: zrem(16);
    margin: 0 zrem(10);
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .switch-group-con {
    width: zrem(16);
    height: zrem(16);
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

html.black {
  .black {
    display: inline-block;
  }
}

html.white {
  .white {
    display: inline-block;
  }
}

.from_item {
  width: zrem(300);
}

.group-list-con {
  width: 100%;
  box-sizing: border-box;
  padding: zrem(40) zrem(20);

  .group-list-header {
    margin-bottom: zrem(20);

    .group-list-header-box {
      width: zrem(6);
      height: zrem(20);
      background: var(--el-menu-active-color);
    }

    .group-list-header-name {
      height: zrem(20);
      line-height: zrem(20);
      margin-left: zrem(10);
    }
  }

  .group-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .group-item {
      width: zrem(70);
      height: zrem(70);
      margin: zrem(10);
      cursor: pointer;

      .group-item-icon {
        width: zrem(22);
        height: zrem(22);
        margin: 0 auto zrem(10);

        img {
          width: 100%;
          height: 100%;
        }
      }

      .group-item-name {
        font-size: zrem(14);
        text-align: center;
      }
    }

    .active-group-item {
      .group-item-name {
        color: var(--el-menu-active-color);
      }
    }
  }
}

.scheduling-item {
  .scheduling-title-word {
    color: var(--el-text-color-primary);
    font-size: zrem(14);
    margin-bottom: zrem(10);
  }

  .scheduling-content {
    .scheduling-content-textarea {
      width: zrem(300);
      color: var(--el-text-color-primary);
      resize: none;
    }
  }
}
</style>
