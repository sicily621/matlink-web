
/**
 * 转为符合element tree格式的数据
 */
export const nameToLabel = (arr: any[], key?: string,mapNames?:any,mapKey?:string): any[] => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].children = nameToLabel(arr[i].children || []);

    if (mapNames && mapKey) {
      arr[i].label = mapNames[arr[i][mapKey] || 'name'];
    } else {
      arr[i].label = arr[i][key || 'name'];
    }
  }
  return arr;
};
/**
 * 递归转element tree格式的数据
 */
export const nameToLabelLevel = (children: any[], key?: string) => {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i].children)) {
      nameToLabelLevel(children[i].children, key);
    }
    children[i].label = children[i][key || 'name'];
  }
}