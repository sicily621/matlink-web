import type { PropType } from 'vue'
import { type Position } from "./index"
export interface Marker {
    id?: number
    objectId: number
    showLabel?: boolean
    groupId: number
    name: string
    width?: number
    height?: number
    url?: string//贴图路径
    color?: string
    type: MarkerType
    position: Position
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
        required: true
    },
    bindPointMode: {
        type: Boolean,
        default: false
    },
} as const;