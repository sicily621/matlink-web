import type { PropType } from 'vue'
import { type Position } from "./map"
import { RoamingStatus } from "./road"
import { Vector3 } from "three";
export interface Marker {
    id?: number
    objectId: number
    groupId?: number | symbol
    showLabel?: boolean
    visible?: boolean
    name: string
    width?: number
    height?: number
    url?: string//贴图路径
    color?: number
    type: MarkerType
    position: Position
    state?: number
    rawData?: any
    [key: string]: any
}
export enum MarkerType {
    IMAGE,
    TEXT
}


export const MarkerProps = {
    data: {
        type: Object as PropType<Marker>,
        required: true,
        default: () => {
            return {
                width: 10,
                height: 10,
                visible: true,
                color: 0xffffff,
                type: MarkerType.IMAGE,
                position: { x: 0, y: 10, z: 0 },
                url: "/api/service/center/common/base/api/resources/upload/tenant/200000/P200000001/building/54cca9a1af914fd483e4697b9eec5804.jpg"
            }
        }
    },
    labelOffset: {
        type: Object as PropType<Position>,
        default: () => {
            return { x: 0, y: 0, z: 0 }
        }
    },
    status: {
        required: true,
        type: Number as PropType<RoamingStatus>,
    },
} as const;

export const checkInView = (vector: any, camera: any) => {
    let tempV = vector.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    if (Math.abs(tempV.x) > 1 || Math.abs(tempV.y) > 1 || Math.abs(tempV.z) > 1) {
        // 在视野外了
        return false;
    } else {
        // 在视野内
        return true;
    }
}

//三维坐标转换成屏幕坐标
export const getScreenVector = (vector: Vector3, context: any) => {
    const camera = context.camera.value;
    const width = context.sizes.width.value;
    const height = context.sizes.height.value;
    const inView = checkInView(vector, camera);
    if (!inView) return;
    var pos = vector.clone().project(camera);
    var widthHalf = width / 2,
        heightHalf = height / 2;
    pos.x = pos.x * widthHalf + widthHalf;
    pos.y = -pos.y * heightHalf + heightHalf;
    return pos;
}