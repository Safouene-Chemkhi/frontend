import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class WebsocketService  {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('https://localhost:3000');
  }

  // EMITTER
  sendMessage(msg: string) {
    console.log('getting data')
    this.socket.emit('getData', { message: msg });
  }

  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('data', msg => {
        console.log(msg);
        
        observer.next(msg);
      });
    });
  }
}
