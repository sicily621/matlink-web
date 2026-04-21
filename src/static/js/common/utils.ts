import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { encodedBase64, decodeBase64 } from "./crypto"
import xss from 'xss';
/**
 * 去除str里的所有空格
 * @param str
 * @returns
 */
export const trim = (str: string) => str.replace(/\s+/g, "");

/**
 * 对象转为query形式
 */
export const objToQuery = (obj: any) => new URLSearchParams(Object.entries(obj)).toString();

/**
 * 生成随机id
 */
export const randomString = (e: number) => {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}
export const getDataType = () => {
  return [
    {
      value: 1,
      name: (window as any).$i18nMFunc("utils.dataType.boolean"),
      checked: false,
    },
    {
      value: 2,
      name: (window as any).$i18nMFunc("utils.dataType.unsignedByte"),
      checked: false,
    },
    {
      value: 4,
      name: (window as any).$i18nMFunc("utils.dataType.byte"),
      checked: false,
    },

    {
      value: 8,
      name: (window as any).$i18nMFunc("utils.dataType.unsignedShort"),
      checked: false,
    },
    {
      value: 16,
      name: (window as any).$i18nMFunc("utils.dataType.signedShort"),
      checked: false,
    },
    {
      value: 32,
      name: (window as any).$i18nMFunc("utils.dataType.unsignedInt"),
      checked: false,
    },
    {
      value: 64,
      name: (window as any).$i18nMFunc("utils.dataType.signedInt"),
      checked: false,
    },
    {
      value: 128,
      name: (window as any).$i18nMFunc("utils.dataType.unsignedLong"),
      checked: false,
    },
    {
      value: 256,
      name: (window as any).$i18nMFunc("utils.dataType.signedLong"),
      checked: false,
    },
    {
      value: 512,
      name: (window as any).$i18nMFunc("utils.dataType.float"),
      checked: false,
    },
    {
      value: 1024,
      name: (window as any).$i18nMFunc("utils.dataType.double"),
      checked: false,
    },
    {
      value: 2048,
      name: (window as any).$i18nMFunc("utils.dataType.string"),
      checked: false,
    }, {
      value: 4096,
      name: (window as any).$i18nMFunc("utils.dataType.date"),
      checked: false,
    }, {
      value: 8192,
      name: (window as any).$i18nMFunc("utils.dataType.array"),
      checked: false,
    }, {
      value: 16384,
      name: (window as any).$i18nMFunc("utils.dataType.image"),
      checked: false,
    },
    {
      value: 32768,
      name: "JSON",
      checked: false,
    },
  ]
};
export const getValueList = (e: any, list: any) => {
  const isDataChange = (arr1: Array<any>, arr2: Array<any>) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].value !== arr2[i].value) {
        return false;
      }
    }
    return e;
  };

  const newData = list.map((item: any) => ({ ...item }));

  if (!isDataChange(newData, list)) {
    return list = newData;
  } else {
    return list
  }
};

/*export const getDataType = (e: any) => {
  return getValueList(e, dataType())
};*/
/**
 * 跳转组或者跳转菜单
 */
export const targetRouter = (data: any) => {
  const route = useRoute();
  const queryData: any = {
    groupId: route.query.groupId,
    tenantId: String(window.$HyGlobal.getCurrentProject()?.tenantId || "")
  };
  if (data.targetType === 1) {
    queryData.mid = data.targetId;
  }
  if (data.targetType === 2) { //链接组
    if (route.query.groupId) {
      if (Array.isArray(route.query.groupId)) {
        const arr = route.query.groupId;
        arr.push(data.targetId);
        queryData.groupId = arr;
      } else {
        queryData.groupId = [route.query.groupId, data.targetId];
      }
    } else {
      queryData.groupId = data.targetId;
    }
  }
}

/**
 * 返回到上一分组
 */
export const sendGroup = () => {
  const route = useRoute();
  console.log('查看route数据：', route);
}

export const getTestCid = (arr: any[]) => {
  if (arr[0].templateId) {
    return arr[0].cid;
  }
  if (arr[0] && Array.isArray(arr[0].children) && arr[0].children.length) getTestCid(arr[0].children);
}


/**
 * 存base64加密值
 * @param key
 * @param value
 * @param isLocalStorage 默认是true,存localStorage，false存sessionStorage
 */
export const setItem = (key: string, value: any, isLocalStorage: boolean = true) => {
  const encodedValue = encodedBase64(JSON.stringify(value))
  if (isLocalStorage) {
    localStorage.setItem(key, encodedValue)
  } else {
    sessionStorage.setItem(key, encodedValue)
  }
}
/**
 * 取base64解密值
 * @param key
 * @param isLocalStorage 默认是true,取localStorage，false取sessionStorage
 */
export const getItem = (key: string, isLocalStorage: boolean = true) => {
  const decodeValue = isLocalStorage ? localStorage.getItem(key) : sessionStorage.getItem(key)
  return decodeValue ? JSON.parse(decodeBase64(decodeValue)) : ""
}
/**
 * 删除某个键值对
 * @param key
 * @param isLocalStorage 默认是true,取localStorage，false取sessionStorage
 */
export const removeItem = (key: string, isLocalStorage: boolean = true) => {
  isLocalStorage ? localStorage.removeItem(key) : sessionStorage.removeItem(key)
}

//整数
export const isInteger = (value: string) => {
  const pattern = /^-?\d+$/
  return pattern.test(value);
}
//字符串
export const isString = (value: string) => {
  return typeof value === 'string';
}
//布尔字符串
export const isBoolean = (value: string) => {
  const pattern = /^[01]$/;
  return pattern.test(value);
}
//ip
export const isIP = (value: string) => {
  const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}(?<!-))\.(?!-)([A-Za-z0-9]{1,63}(?<!-))(?:\.[A-Za-z]{2,})*$/;
  const domainPattern = /^(?!-)([A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,}|xn--[a-z0-9]+)\.?$/;
  return ipRegex.test(value) || domainRegex.test(value) || domainPattern.test(value);
}
//mac地址
export const isMac = (value: string) => {
  const regex = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;
  return regex.test(value);
}
//时间格式
export const isDateTime = (value: string) => {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return regex.test(value);
}
//端口
export const isPort = (value: string) => {
  const number = parseInt(value, 10);
  return Number.isInteger(number) && number >= 0 && number <= 65535;
}
//数组字符串
export const isArray = (value: string) => {
  try {
    const result = JSON.parse('[' + value + ']');
    return Array.isArray(result);
  } catch (e) {
    return false;
  }
}
//文件路径
export const isFilePath = (value: string) => {
  return /^(\/|\\|[A-Za-z]:\\|[A-Za-z]:\/).+/.test(value);
}

/**
 * 导出excel文件
 * @param data
 * @param filename
 */
export const exportExcel = (data: Blob, filename: string) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // 指定MIME类型
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

//计算表格序号的
export const indexMethod = (page: number, size: number) => {
  return (index: number) => {
    return page * size + index + 1;
  }
}

/**
 * 单独给某个字段添加xss验证
 * @returns
 */
export const ruleXssValidator = (_: any, value: any, callback: any) => {
  if (typeof value != 'string') {
    callback();
  } else if (xss(value) != value) {
    callback(new Error("非法输入"));
  } else {
    callback();
  }
}

/**
 * 给所有放在rules里的字段添加xss验证
 * @param rules
 * @returns
 */
export const rulesAddXss = (rules: any) => {
  for (let key in rules) {
    if (Array.isArray(rules[key])) {
      rules[key].push({ validator: ruleXssValidator });
    } else {
      rules[key] = [{ validator: ruleXssValidator }]
    }
  }
  return rules;
}
//保留小数点后两位
export const formatTwoDecimals = (value: any, place: number = 2) => {
  if (value === "") return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  const isInteger = num % 1 === 0;
  if (isInteger) {
    return num;
  } else {
    return num.toFixed(place);
  }
};