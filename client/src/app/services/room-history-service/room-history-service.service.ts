import { Message } from 'src/app/models/Message';
import { Injectable } from '@angular/core';
import { v4 as uuidv4, } from 'uuid';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RoomHistoryServiceService {

    /*    roomid: string;  id: string;  message: string;  sentBy: string;  timestamp: Date */;
  messages: Array<Message> = [
    { roomid: "1", id: "1", message: "Message sent by server", sentBy: "Server", timestamp: new Date() },
    { roomid: "1", id: "1", message: "Message sent by server", sentBy: "Server", timestamp: new Date() },
    { roomid: "1", id: "1", message: "Message sent by server", sentBy: "Server", timestamp: new Date() }
  ];

  constructor(private socketMan : SocketManagerService) { }

  public sendMessage(mVal : string, id : string) {
    let message = { roomid: id, id: uuidv4(), message: mVal, sentBy: "User", timestamp: new Date() };

    this.socketMan.emitEvent(id, message);
  }
}
