import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { StripeAddressElement, StripePaymentElement } from '@stripe/stripe-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { Address as AppAddress } from '../../shared/models/user';
import { CheckoutDeliveryComponent } from "../checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "../checkout-review/checkout-review.component"; // Import app's Address type with alias

@Component({
  selector: 'app-checkout',
  imports: [OrderSummaryComponent, MatStepperModule, MatButton, RouterLink, MatCheckboxModule, CheckoutDeliveryComponent, CheckoutReviewComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit ,OnDestroy{
 
  private stripeService=inject(StripeService);
  addressElement?: StripeAddressElement;
  private snackbar=inject(SnackbarService);
  saveAddress=false;
  private accountService = inject(AccountService);
  paymentElement?: StripePaymentElement;

  async ngOnInit() {
    try {
      // Only initialize the address element on component load
      this.addressElement = await this.stripeService.createAddressElement();
      if (this.addressElement) {
        this.addressElement.mount('#address-element');
      } else {
        this.snackbar.error('Unable to load address form. Please try again.');
      }
    }
    catch (error: any) {
      console.error('Error initializing address element:', error.message);
      this.snackbar.error('Unable to initialize checkout. Please try again later.');
    }
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }

  async onStepChange(event:StepperSelectionEvent){
    if(event.selectedIndex==1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if(event.selectedIndex==2){
      try {
        // Ensure payment intent is created/updated before creating payment element
        await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
        
        // Create payment element when user navigates to payment step
        this.paymentElement = await this.stripeService.createPaymentElement();
        
        if (this.paymentElement) {
          console.log('Payment element created successfully in step change');
          this.paymentElement.mount('#payment-element');
        } else {
          console.error('Payment element is undefined in step change');
          this.snackbar.error('Unable to load payment form. Please try again later.');
        }
      } catch (error: any) {
        console.error('Error initializing payment element in step change:', error);
        this.snackbar.error('Payment processing is currently unavailable.');
      }
    }
    if(event.selectedIndex==3){
      // Review step logic
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }
  
  private async getAddressFromStripeAddress(): Promise<AppAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      };
    } else return null;
  }
}
