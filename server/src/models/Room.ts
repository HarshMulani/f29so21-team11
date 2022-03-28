import { Message } from "./Message";

export interface Room {
    id: string;
    type: string;
    name: string;
    manager: string;
    history: Array<Message>;
    participants: Array<String>;
}