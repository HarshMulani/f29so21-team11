import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'src/app/models/Color';
import { WhiteBoardRoom } from 'src/app/models/WhiteBoardRoom';
import { GroupManagerService } from '../group-manager/group-manager.service';
import { RoomManagerService } from '../room-manager/room-manager.service';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardManagerService {

  canvasList: Array<{id: string, canvas: HTMLElement | null}> = []

  constructor(private socketMan: SocketManagerService, private activeRoute: ActivatedRoute, private groupMan:  GroupManagerService) { }



}
