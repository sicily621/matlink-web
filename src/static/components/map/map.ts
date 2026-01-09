import { type PropType, ref } from 'vue'
import { Marker } from "./marker"
import { Label } from "./label"
import { Road } from "./road"
import fontFile from "./fhj.ttf";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { RoamingStatus } from "./road"

export interface Map {
    bindPointMode: boolean;//绑点状态
    sky?: boolean; //天空盒子
    autoRotate?: boolean; //自动旋转
    backgroundColor?: string; //背景色
    cameraPosition?: Position //相机默认位置
    mode?: MapMode
}
export interface Position {
    x: number
    y: number
    z: number
}
export enum MapMode {
    DAY,
    NIGHT
}

export const MapProps = {
    bindPointMode: {
        type: Boolean,
        default: false
    },
    onlySky: {
        type: Boolean,
        default: false
    },
    grid: {
        type: Boolean,
        default: false,
    },
    sky: {
        type: Boolean,
        default: true,
    },
    mode: {
        type: Number as PropType<MapMode>,
        default: MapMode.DAY,
    },
    skyUrls: {
        type: Array as PropType<string[]>,
        default: () => {
            return []
        }
    },
    prevSceneUrls: {
        type: Array as PropType<string[]>,
        default: () => {
            return []
        }
    },
    needCacheSky: {
        type: Boolean,
        default: false
    },
    autoRotate: {
        type: Boolean,
        default: false,
    },
    backgroundColor: {
        type: String
    },
    cameraPosition: {
        type: Object as PropType<Position>,
        default: () => {
            return { x: 200, y: 500, z: 0 }
        }
    },
    markerList: {
        type: Array as PropType<Marker[]>,
        default: () => {
            return []
        }
    },
    labelList: {
        type: Array as PropType<Label[]>,
        default: () => {
            return []
        }
    },
    roamingStatus: {
        type: Number as PropType<RoamingStatus>,
        default: () => {
            return RoamingStatus.STOP
        }
    },
    roadList: {
        type: Array as PropType<Road[]>,
        default: () => {
            return [
                // {
                //     objectId: 1,
                //     points: [
                //         { x: -150, y: 30, z: -150 },
                //         { x: -150, y: 30, z: 0 },
                //         { x: 150, y: 30, z: 150 },
                //         { x: 250, y: 30, z: -20 }
                //     ]
                // }
            ]
        }
    },
    roamingSpeed: {
        type: Number,
        default: () => {
            return 1
        }
    },
    roadLabelShowIndex: {
        type: Number,
        default: () => {
            return 0
        }
    },
    onReachRoamingPoint: {
        type: Function as PropType<(...args: any[]) => void>
    },
    labelOffset: {
        type: Object as PropType<Position>,
        default: () => {
            return { x: 0, y: 0, z: 0 }
        }
    },
    compass: {
        type: Boolean,
        default: true,
    }
} as const;

const font = ref();
export const getFont = (cb?: Function) => {
    if (font.value) {
        cb && cb(font.value)
    } else {
        const loader = new TTFLoader();
        loader.load(fontFile, (json: any) => {
            font.value = new Font(json);
            cb && cb(font.value)
        });
    }
};
