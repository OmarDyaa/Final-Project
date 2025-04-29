import { Injectable, signal, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connected');
        this.hubConnection?.on('OrderCompleteNotification', (order: Order) => {
          this.orderSignal.set(order);
        });
      })
      .catch(error => {
        console.error('Error starting SignalR connection:', error);
      });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection?.stop()
        .catch(error => console.error('Error stopping SignalR connection:', error));
    }
  }
}
