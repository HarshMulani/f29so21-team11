import { Message } from "./Message";

export interface Room {
    id: string;
    name: string;
    history: Array<Message>;
}