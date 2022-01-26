import { Message } from "./Message";

export interface Room {
    id: string;
    type: string;
    name: string;
    history: Array<Message>;
}