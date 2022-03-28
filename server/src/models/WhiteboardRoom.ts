import { User } from "./User";
import { Room } from "./Room";

export interface WhiteBoardRoom {
    id: string;
    name: string;
    manager: string;
    whiteboard: string;
    chat: Room;
    participants: Array<string>;
}