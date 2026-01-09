import type { PropType } from 'vue'
import { type Position } from "./map"

export enum RoamingStatus {
    ROAMING = 1,
    PAUSE = 2,
    STOP = 3,
}

export interface Road {
    id?: number
    name?: string
    height?: number
    color?: number
    roadPoints: Position[]
    rawData?: any
    [key: string]: any
}

export const RoadProps = {
    data: {
        type: Object as PropType<Road>,
        required: true
    },
    roadLabelShowIndex: {
        type: Number,
        required: true
    },
    status: {
        required: true,
        type: Number as PropType<RoamingStatus>,
    },
    roamingSpeed: {
        required: true,
        type: Number
    },
    roamingRoadIndex: {
        required: true,
        type: Number as PropType<number>,
    },
    currentIndex: {
        required: true,
        type: Number as PropType<number>,
    },
    onReachRoamingPoint: {
        type: Function as PropType<(...args: any[]) => void>,
    },
    setRoamingCamera: {
        required: true,
        type: Function as PropType<(...args: any[]) => void>,
    }
} as const;