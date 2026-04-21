export const readRouter = (jsonObjArr: any[]): any[] => {
  const arr: any[] = [];
  const targetRouter = (jsonObjArr: any[]) => {
    for (let item of jsonObjArr) {
      if (Array.isArray(item.children) && item.children.length) {
        targetRouter(item.children);
      } else {
        arr.push({
          title: item.name,
          component: `../../../functions${item.path}`
        })
      }
    }
  }
  targetRouter(jsonObjArr);
  return arr;
}

export const dynamicGraphJsons = import.meta.glob('../../../functions/dynamicGraph/**/*.json', {
  eager: true
});

export const handlerdynamicGraphJsonTreeArr = (arr: any): any[] => {
  const readJson = (jsonTreeArr: any[]) => {
    for (let i = 0; i < jsonTreeArr.length; i++) {
      if (Array.isArray(jsonTreeArr[i].children)) {
        readJson(jsonTreeArr[i].children);
      }
      jsonTreeArr[i].id = jsonTreeArr[i].name + jsonTreeArr[i].path;
      jsonTreeArr[i].label = jsonTreeArr[i].name;
    }
  }
  readJson(arr);
  return arr;
}

