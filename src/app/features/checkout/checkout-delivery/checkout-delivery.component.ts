import { Component, inject, OnInit, output } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CheckoutService } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule,CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);
   cartService = inject(CartService);
    deliveryComplete = output<boolean>();
  ngOnInit(): void {
     this.checkoutService.getDeliveryMethods().subscribe({
       next: methods => {
         if (this.cartService.cart()?.deliveryMethodId) {
           const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
           if (method) {
             this.cartService.selectedDelivery.set(method);
             this.deliveryComplete.emit(true);
           }
         }
       }
     });
   }
 
   updateDeliveryMethod(method: DeliveryMethod) {
     this.cartService.selectedDelivery.set(method);
     const cart = this.cartService.cart();
     if (cart) {
       cart.deliveryMethodId = method.id;
       this.cartService.setCart(cart);
       this.deliveryComplete.emit(true);

     }
   }
 }

