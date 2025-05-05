import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  HttpTransportType,
} from '@microsoft/signalr';
import { Order } from '../../shared/models/order';
import { SnackbarService } from './snackbar.service';
import { Product } from '../../shared/models/product';
import { ProductUpdateService } from './product-update.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  constructor(
    private snackbarService: SnackbarService,
    private productUpdateService: ProductUpdateService
  ) {}

  createHubConnection() {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: true,
          // Don't skip negotiation to allow fallback to other transport methods
          skipNegotiation: false,
          // Allow multiple transport types instead of just WebSockets
          transport:
            HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // More retry attempts with increasing delays
        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connected successfully');

          this.hubConnection?.on(
            'OrderCompleteNotification',
            (order: Order) => {
              this.orderSignal.set(order);
            }
          );

          // Add listener for product updates
          this.hubConnection?.on(
            'ProductUpdateNotification',
            (product: Product) => {
              console.log('Product update received via SignalR:', product);
              this.productUpdateService.notifyProductUpdate(product);
            }
          );

          // Add listener for product deletions
          this.hubConnection?.on(
            'ProductDeleteNotification',
            (productId: number) => {
              console.log('Product deletion received via SignalR:', productId);
              // You may need to handle product deletions in the UI
              // For now, we'll use the notifyProductUpdate with null to signal a removal
              // We can handle this case in the component effects
            }
          );
        })
        .catch((error) => {
          console.error('SignalR connection error:', error);
          // Don't show error to user as this might not be critical
          // and could happen if backend is not running
        });
    } catch (error) {
      console.error('SignalR setup error:', error);
    }
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }
}
