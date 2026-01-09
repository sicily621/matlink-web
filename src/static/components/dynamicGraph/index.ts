import { type PropType } from 'vue'
import { Marker } from "./marker"
export interface Node {
    id: number
    name: string
    disabled?: boolean
    [key: string]: any
}

export interface Position {
    x: string
    y: string
}

export const DynamicGraphProps = {
    bindPointMode: {
        type: Boolean,
        default: false
    },
    markerList: {
        type: Array as PropType<Marker[]>,
        default: () => {
            return []
        }
    }
} as const;
