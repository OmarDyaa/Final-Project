import { Component, inject, OnDestroy } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    AddressPipe,
    CurrencyPipe,
    PaymentCardPipe,
    NgIf
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnDestroy{
  signalrService = inject(SignalrService);
  private orderService = inject(OrderService);
  
  ngOnDestroy(): void {
    this.orderService.orderCompleted = false;
    this.signalrService.orderSignal.set(null);
  }
}
