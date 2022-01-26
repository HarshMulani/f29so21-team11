import { Color } from "./Color";

export interface WhiteBoardAction {
    roomId: string;
    x: number;
    y: number;
    size: number;
    color: Color;
}