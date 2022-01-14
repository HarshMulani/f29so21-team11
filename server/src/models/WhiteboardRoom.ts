import { Room } from "./Room";

export interface WhiteBoardRoom {
    id: string;
    name: string;
    whiteboard: string;
    chat: Room;
}