import { ResizeKey, removeMember, setMember, startResize } from "./dom";


const countHandler = (clientHeight: number, headerHeight: number, rowHeight: number) => Math.ceil((clientHeight - headerHeight) / rowHeight);

export const getPageSizeCount = (dom: any, cb: Function, heightConfig?: any) => {
  const headerHeight = (heightConfig && heightConfig.header) ? heightConfig.header : 44;
  const rowHeight = (heightConfig && heightConfig.row) ? heightConfig.row : 46;
  cb(countHandler(dom.clientHeight, headerHeight, rowHeight));
  const tablePageCountlisten =  () => {
    const count = countHandler(dom.clientHeight, headerHeight, rowHeight);
    if (count <= -1) {
      removeMember(ResizeKey.Table);
    } else {
      cb(count < 1 ? 1 : count);
    }
  }
  setMember(ResizeKey.Table, tablePageCountlisten);
  startResize();
}

export const getPageCount = (total: number, pageSize: number) => Math.floor(total / pageSize);

