import type { PropType } from 'vue'
import { type Position } from "./map"
import { Area } from "./area"
import { RoamingStatus } from "./road"

export interface Label extends Area {
    id?: number
    objectId: number
    groupId?: number | symbol
    visible?: boolean
    name: string
    position: Position
    direction: Position
    fontSize?: number
    rawData?: any
    [key: string]: any
}

export const LabelProps = {
    data: {
        type: Object as PropType<Label>,
        required: true,
        default: () => {
            return {
                visible: true,
                name: "",
                bgColor: 0xFFFFFF,
                fontColor: 0x000000,
                image: "",
                isFull: 1,
                isLine: 1,
                isTitle: 1,
                lineColor: 0x000000,
                lineType: 0,
                lineWidth: 1,
                transparency: 0
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