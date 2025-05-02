// // //--------------------------------------

// // import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// // import { FormsModule } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { ChatbotService } from '../chatbot.service';
// // import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// // import { Router } from '@angular/router';
// // import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// // interface Chat {
// //   id: string;
// //   sender: 'User' | 'Bot';
// //   message: string;
// // }

// // interface Product {
// //   name: string;
// //   price: number;
// //   type: string;
// //   brand: string;
// //   quantityInStock: number;
// //   description: string;
// //   url: string;
// //   id: string;
// //   pictureUrl: string;
// // }

// // @Component({
// //   selector: 'app-chatbot',
// //   imports: [FormsModule, CommonModule],
// //   templateUrl: './chatbot.component.html',
// //   styleUrls: ['./chatbot.component.scss'],
// //   standalone: true
// // })
// // export class ChatbotComponent implements OnInit, OnDestroy {
// //   @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
// //   @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
// //   userMessage: string = '';
// //   chatHistory: Chat[] = [];
// //   isLoading: boolean = false;
// //   errorMessage: string | null = null;
// //   isChatVisible: boolean = false;
// //   suggestions: string[] = [ 'Show Boots',
// //     'Show Board',
// //     'Check stock for GripZone Gloves',
// //     'Top priced product' ]
// //   private destroy$ = new Subject<void>();
// //   private sendMessageSubject = new Subject<string>();

// //   constructor(
// //     private chatbotService: ChatbotService,
// //     private sanitizer: DomSanitizer,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void { this.chatHistory.push({ id: this.generateId(),
// //     sender: 'Bot',
// //      message: 'Hello! Welcome to our store. Ask about products, types (Boots, Boards, Gloves, Hats), brands (BoardRush, ProGear, LiteWear, HeadWarm, GripZone, TrailEdge), price, How can I help you?' });

// //     this.sendMessageSubject
// //       .pipe(
// //         debounceTime(300),
// //         distinctUntilChanged(),
// //         takeUntil(this.destroy$)
// //       )
// //       .subscribe((message) => this.processMessage(message));
// //   }

// //   ngOnDestroy(): void {
// //     this.destroy$.next();
// //     this.destroy$.complete();
// //   }

// //   toggleChat(): void {
// //     this.isChatVisible = !this.isChatVisible;
// //     if (this.isChatVisible) {
// //       setTimeout(() => {
// //         this.chatInput.nativeElement.focus();
// //         this.scrollToBottom();
// //       }, 0);
// //     }
// //   }

// //   sendMessage(): void {
// //     if (!this.userMessage.trim() || this.isLoading) {
// //       this.userMessage = '';
// //       return;
// //     }

// //     const message = this.userMessage.trim();
// //     this.sendMessageSubject.next(message);
// //   }

// //   private processMessage(message: string): void {
// //     this.chatHistory.push({
// //       id: this.generateId(),
// //       sender: 'User',
// //       message
// //     });

// //     this.userMessage = '';
// //     this.isLoading = true;
// //     this.errorMessage = null;
// //     this.scrollToBottom();

// //     this.chatbotService.sendMessage(message).pipe(takeUntil(this.destroy$)).subscribe({
// //       next: (response) => {
// //         this.chatHistory.push({
// //           id: this.generateId(),
// //           sender: 'Bot',
// //           message: response.message
// //         });
// //         this.isLoading = false;
// //         this.scrollToBottom();
// //       },
// //       error: (error) => {
// //         console.error('❌ Error communicating with the chatbot:', error);
// //         const errorMsg = '❌ Error: Could not connect to the chatbot. Please try again.';
// //         this.chatHistory.push({
// //           id: this.generateId(),
// //           sender: 'Bot',
// //           message: errorMsg
// //         });
// //         this.isLoading = false;
// //         this.errorMessage = 'Failed to get a response. Please try again.';
// //         this.scrollToBottom();
// //       }
// //     });
// //   }

// //   private scrollToBottom(): void {
// //     setTimeout(() => {
// //       if (this.chatBox) {
// //         this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
// //       }
// //     }, 0);
// //   }

// //   clearError(): void {
// //     this.errorMessage = null;
// //   }

// //   trackByFn(index: number, chat: Chat): string {
// //     return chat.id;
// //   }

// //   private generateId(): string {
// //     return Date.now().toString(36) + Math.random().toString(36).substr(2);
// //   }

// //   parseProductResponse(message: string): Product | null {
// //     const productRegex = /Name: (.+)\nPrice: \$([\d.]+)\nType: (.+)\nBrand: (.+)\nStock: (\d+)\nDescription: (.+)\nImage: (.+)\nView Details: (.+)/;
// //     const match = message.match(productRegex);
// //     if (match) {
// //       const [, name, price, type, brand, quantityInStock, description, pictureUrl, url] = match;
// //       const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
// //       return {
// //         name,
// //         price: parseFloat(price),
// //         type,
// //         brand,
// //         quantityInStock: parseInt(quantityInStock),
// //         description,
// //         pictureUrl,
// //         url,
// //         id: idMatch ? idMatch[2] : ''
// //       };
// //     }
// //     return null;
// //   }

// //   formatBotMessage(message: string): string {

// //     message = message.replace(
// //       /- (.+)\s\(\$([\d.]+),\sType:\s(.+),\sBrand:\s(.+),\sStock:\s(\d+)\)\s\[View Details\]\((.+?)\)/g,
// //     '<div class="product-item">- <a href="$6" target="_blank" style="color: blue; text-decoration: underline;">$1</a> (Price: $2, Type: $3, Brand: $4, Stock: $5)</div>'  );

// //     message = message.replace(
// //       /\[View Details\]\((https?:\/\/[^\s)]+)\)/g,

// //       '<div class="product-item">- <a href="$1" target="_blank" class="view-details-link">View Details</a></div>'
// //   );

// //     message = message.replace(
// //       /- (Boots|Boards|Gloves|Hats|BoardRush|ProGear|LiteWear|HeadWarm|GripZone|TrailEdge)/g,
// //       '<div class="type-brand-item">- $1</div>'
// //   );

// //     message = message.replace(/\n/g, '<br>');

// //     return message;
// // }

// //   sanitizeMessage(message: string): SafeHtml {
// //     return this.sanitizer.bypassSecurityTrustHtml(message);
// //   }

// //   navigateToProduct(url: string): void {
// //     const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
// //     if (idMatch) {
// //       const route = idMatch[1] === 'shop' ? `/shop/${idMatch[2]}` : `/products/details/${idMatch[2]}`;
// //       this.router.navigate([route]);
// //     }
// //   }
// // }

// // import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// // import { FormsModule } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { ChatbotService } from '../chatbot.service';
// // import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// // import { Router } from '@angular/router';
// // import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// // interface Chat {
// //   id: string;
// //   sender: 'User' | 'Bot';
// //   message: string;
// // }

// // interface Product {
// //   name: string;
// //   price: number;
// //   type: string;
// //   brand: string;
// //   quantityInStock: number;
// //   description: string;
// //   url: string;
// //   id: string;
// //   pictureUrl: string;
// // }

// // @Component({
// //   selector: 'app-chatbot',
// //   imports: [FormsModule, CommonModule],
// //   templateUrl: './chatbot.component.html',
// //   styleUrls: ['./chatbot.component.scss'],
// //   standalone: true
// // })
// // export class ChatbotComponent implements OnInit, OnDestroy {
// //   @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
// //   @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
// //   userMessage: string = '';
// //   chatHistory: Chat[] = [];
// //   isLoading: boolean = false;
// //   errorMessage: string | null = null;
// //   isChatVisible: boolean = false;
// //   suggestions: string[] = [
// //     'Show Boots',
// //     'Show Board',
// //     'Show Gloves',
// //     'what about BoardRush?'
// //   ];
// //   private destroy$ = new Subject<void>();
// //   private sendMessageSubject = new Subject<string>();

// //   constructor(
// //     private chatbotService: ChatbotService,
// //     private sanitizer: DomSanitizer,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.chatHistory.push({
// //       id: this.generateId(),
// //       sender: 'Bot',
// //       message: 'Hello! Welcome to our store. Ask about products, types (Boots, Boards, Gloves, Hats), brands (BoardRush, ProGear, LiteWear, HeadWarm, GripZone, TrailEdge), price, How can I help you?'
// //     });

// //     this.sendMessageSubject
// //       .pipe(
// //         debounceTime(300),
// //         distinctUntilChanged(),
// //         takeUntil(this.destroy$)
// //       )
// //       .subscribe((message) => this.processMessage(message));
// //   }

// //   ngOnDestroy(): void {
// //     this.destroy$.next();
// //     this.destroy$.complete();
// //   }

// //   toggleChat(): void {
// //     this.isChatVisible = !this.isChatVisible;
// //     if (this.isChatVisible) {
// //       setTimeout(() => {
// //         this.chatInput.nativeElement.focus();
// //         this.scrollToBottom();
// //       }, 0);
// //     }
// //   }

// //   sendMessage(): void {
// //     if (!this.userMessage.trim() || this.isLoading) {
// //       this.userMessage = '';
// //       return;
// //     }

// //     const message = this.userMessage.trim();
// //     this.sendMessageSubject.next(message);
// //   }

// //   private processMessage(message: string): void {
// //     this.chatHistory.push({
// //       id: this.generateId(),
// //       sender: 'User',
// //       message
// //     });

// //     this.userMessage = '';
// //     this.isLoading = true;
// //     this.errorMessage = null;
// //     this.scrollToBottom();

// //     this.chatbotService.sendMessage(message).pipe(takeUntil(this.destroy$)).subscribe({
// //       next: (response) => {
// //         this.chatHistory.push({
// //           id: this.generateId(),
// //           sender: 'Bot',
// //           message: response.message
// //         });
// //         this.isLoading = false;
// //         this.scrollToBottom();
// //       },
// //       error: (error) => {
// //         console.error('❌ Error communicating with the chatbot:', error);
// //         const errorMsg = '❌ Error: Could not connect to the chatbot. Please try again.';
// //         this.chatHistory.push({
// //           id: this.generateId(),
// //           sender: 'Bot',
// //           message: errorMsg
// //         });
// //         this.isLoading = false;
// //         this.errorMessage = 'Failed to get a response. Please try again.';
// //         this.scrollToBottom();
// //       }
// //     });
// //   }

// //   private scrollToBottom(): void {
// //     setTimeout(() => {
// //       if (this.chatBox) {
// //         this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
// //       }
// //     }, 0);
// //   }

// //   clearError(): void {
// //     this.errorMessage = null;
// //   }

// //   trackByFn(index: number, chat: Chat): string {
// //     return chat.id;
// //   }

// //   private generateId(): string {
// //     return Date.now().toString(36) + Math.random().toString(36).substr(2);
// //   }

// //   parseProductResponse(message: string): Product | null {
// //     const productRegex = /Name: (.+)\nPrice: \$([\d.]+)\nType: (.+)\nBrand: (.+)\nStock: (\d+)\nDescription: (.+)\nImage: (.+)\nView Details: (.+)/;
// //     const match = message.match(productRegex);
// //     if (match) {
// //       const [, name, price, type, brand, quantityInStock, description, pictureUrl, url] = match;
// //       const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
// //       return {
// //         name,
// //         price: parseFloat(price),
// //         type,
// //         brand,
// //         quantityInStock: parseInt(quantityInStock),
// //         description,
// //         pictureUrl,
// //         url,
// //         id: idMatch ? idMatch[2] : ''
// //       };
// //     }
// //     return null;
// //   }

// //  formatBotMessage(message: string): string {
// //     // Handle brand details response (e.g., Products by BoardRush)
// //     const brandDetailsRegex = /Products by (.+?):\n((?:- .+?\n(?:  .+?\n)*?(?=- |$))+)/g;
// //     message = message.replace(brandDetailsRegex, (match, brandName, productsBlock) => {
// //       let formattedProducts = productsBlock.replace(
// //         /- (.+)\n  Price: \$?([\d.]+)\n  Type: (.+)\n  Stock: (\d+)(?:\n  Description: (.+)\n  Image: (.+)\n  View Details: (.+))?$/gm,
// //         (match: any, name: any, price: any, type: any, stock: any, description = '', image = '', viewDetails = '') => {

// //           return (
// //             '<div class="product-item">' +
// //             `<div class="product-name">${viewDetails ? `<a href="${viewDetails}" target="_blank" style="color: blue; text-decoration: underline;">${name}</a>` : name}</div>` +
// //             `<div class="product-detail">Price: $${price}</div>` +
// //             `<div class="product-detail">Type: ${type}</div>` +
// //             `<div class="product-detail">Stock: ${stock}</div>` +

// //             '</div>'
// //           );
// //         }
// //       );
// //       return `<div class="brand-section"><h3 class="brand-title">Products by ${brandName}</h3>${formattedProducts}</div>`;
// //     });
// //     // Handle generic product list (e.g., Found 2 products by brand BoardRush)
// //     message = message.replace(
// //       /- (.+)\s\(\$([\d.]+),\sType:\s(.+),\sBrand:\s(.+),\sStock:\s(\d+)\)\s\[View Details\]\((.+?)\)/g,
// //       '<div class="product-item">- <a href="$6" target="_blank" style="color: blue; text-decoration: underline;">$1</a> (Price: $2$, Type: $3, Brand: $4, Stock: $5)</div>'
// //     );

// //     // Handle standalone View Details links
// //     message = message.replace(
// //       /\[View Details\]\((https?:\/\/[^\s)]+)\)/g,
// //       '<div class="product-item"><a href="$1" target="_blank" class="view-details-link">View Details</a></div>'
// //     );

// //     // Handle type/brand list items
// //     message = message.replace(
// //       /- (Boots|Boards|Gloves|Hats|BoardRush|ProGear|LiteWear|HeadWarm|GripZone|TrailEdge)/g,
// //       '<div class="type-brand-item">- $1</div>'
// //     );

// //     // Replace newlines with <br> for remaining text
// //     message = message.replace(/\n/g, '<br>');

// //     return message;
// //   }

// //   sanitizeMessage(message: string): SafeHtml {
// //     return this.sanitizer.bypassSecurityTrustHtml(message);
// //   }

// //   navigateToProduct(url: string): void {
// //     const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
// //     if (idMatch) {
// //       const route = idMatch[1] === 'shop' ? `/shop/${idMatch[2]}` : `/products/details/${idMatch[2]}`;
// //       this.router.navigate([route]);
// //     }
// //   }
// // }

//----------------------------------=======================================

// import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ChatbotService } from '../chatbot.service';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// interface Chat {
//   id: string;
//   sender: 'User' | 'Bot';
//   message: string;
// }

// interface Product {
//   name: string;
//   price: number;
//   type: string;
//   brand: string;
//   quantityInStock: number;
//   description: string;
//   url: string;
//   id: string;
//   pictureUrl: string;
// }

// @Component({
//   selector: 'app-chatbot',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './chatbot.component.html',
//   styleUrls: ['./chatbot.component.scss'],
//   standalone: true
// })
// export class ChatbotComponent implements OnInit, OnDestroy {
//   @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
//   userMessage: string = '';
//   chatHistory: Chat[] = [];
//   isLoading: boolean = false;
//   errorMessage: string | null = null;
//   isChatVisible: boolean = false;
//   suggestions: string[] = [
//     'Show Boots',
//     'Show Board',
//     'Show Gloves',
//     'what about BoardRush?'
//   ];
//   private destroy$ = new Subject<void>();
//   private sendMessageSubject = new Subject<string>();

//   constructor(
//     private chatbotService: ChatbotService,
//     private sanitizer: DomSanitizer,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.chatHistory.push({
//       id: this.generateId(),
//       sender: 'Bot',
//       message: 'Hello! Welcome to our store. Ask about products, types (Boots, Boards, Gloves, Hats), brands (BoardRush, ProGear, LiteWear, HeadWarm, GripZone, TrailEdge), price, How can I help you?'
//     });

//     this.sendMessageSubject
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         takeUntil(this.destroy$)
//       )
//       .subscribe((message) => this.processMessage(message));
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   toggleChat(): void {
//     this.isChatVisible = !this.isChatVisible;
//     if (this.isChatVisible) {
//       setTimeout(() => {
//         this.chatInput.nativeElement.focus();
//         this.scrollToBottom();
//       }, 0);
//     }
//   }

//   sendMessage(): void {
//     if (!this.userMessage.trim() || this.isLoading) {
//       this.userMessage = '';
//       return;
//     }

//     const message = this.userMessage.trim();
//     this.sendMessageSubject.next(message);
//   }

//   private processMessage(message: string): void {
//     this.chatHistory.push({
//       id: this.generateId(),
//       sender: 'User',
//       message
//     });

//     this.userMessage = '';
//     this.isLoading = true;
//     this.errorMessage = null;
//     this.scrollToBottom();

//     this.chatbotService.sendMessage(message).pipe(takeUntil(this.destroy$)).subscribe({
//       next: (response) => {
//         this.chatHistory.push({
//           id: this.generateId(),
//           sender: 'Bot',
//           message: response.message
//         });
//         this.isLoading = false;
//         this.scrollToBottom();
//       },
//       error: (error) => {
//         console.error('❌ Error communicating with the chatbot:', error);
//         const errorMsg = '❌ Error: Could not connect to the chatbot. Please try again.';
//         this.chatHistory.push({
//           id: this.generateId(),
//           sender: 'Bot',
//           message: errorMsg
//         });
//         this.isLoading = false;
//         this.errorMessage = 'Failed to get a response. Please try again.';
//         this.scrollToBottom();
//       }
//     });
//   }

//   private scrollToBottom(): void {
//     setTimeout(() => {
//       if (this.chatBox) {
//         this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
//       }
//     }, 0);
//   }

//   clearError(): void {
//     this.errorMessage = null;
//   }

//   trackByFn(index: number, chat: Chat): string {
//     return chat.id;
//   }

//   private generateId(): string {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2);
//   }

//   parseProductResponse(message: string): Product | null {
//     const productRegex = /Name: (.+)\nPrice: \$([\d.]+)\nType: (.+)\nBrand: (.+)\nStock: (\d+)\nDescription: (.+)\nImage: (.+)\nView Details: (.+)/;
//     const match = message.match(productRegex);
//     if (match) {
//       const [, name, price, type, brand, quantityInStock, description, pictureUrl, url] = match;
//       const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
//       return {
//         name,
//         price: parseFloat(price),
//         type,
//         brand,
//         quantityInStock: parseInt(quantityInStock),
//         description,
//         pictureUrl,
//         url,
//         id: idMatch ? idMatch[2] : ''
//       };
//     }
//     return null;
//   }

//   formatBotMessage(message: string): string {
//     // Handle brand details response (e.g., Products by BoardRush)
//     const brandDetailsRegex = /Products by (.+?):\n((?:- .+?\n(?:  .+?\n)*?(?=- |$))+)/g;
//     message = message.replace(brandDetailsRegex, (match, brandName, productsBlock) => {
//       let formattedProducts = productsBlock.replace(
//         /- (.+)\n  Price: \$([\d.]+)\n  Type: (.+)\n  Stock: (\d+)\n  Description: (.+)\n  Image: (.+)\n  View Details: (.+)/gm,
//         (match: any, name: any, price: any, type: any, stock: any, description: any, image: any, viewDetails: any) => {
//           return (
//             '<div class="product-item">' +
//             `<div class="product-name"><a href="${viewDetails}" target="_blank" style="color: blue; text-decoration: underline;">${name}</a></div>` +
//             `<div class="product-detail">Price: $${price}</div>` +
//             `<div class="product-detail">Type: ${type}</div>` +
//             `<div class="product-detail">Stock: ${stock}</div>` +
//             '</div>'
//           );
//         }
//       );
//       return `<div class="brand-section"><h3 class="brand-title">Products by ${brandName}</h3>${formattedProducts}</div>`;
//     });

//     // Handle generic product list (e.g., Found 2 products by brand BoardRush)
//     message = message.replace(
//       /- (.+)\s\(\$([\d.]+),\sType:\s(.+),\sBrand:\s(.+),\sStock:\s(\d+)\)\s\[View Details\]\((.+?)\)/g,
//       '<div class="product-item">- <a href="$6" target="_blank" style="color: blue; text-decoration: underline;">$1</a> (Price: $2$, Type: $3, Brand: $4, Stock: $5)</div>'
//     );

//     // Handle standalone View Details links
//     message = message.replace(
//       /\[View Details\]\((https?:\/\/[^\s)]+)\)/g,
//       '<div class="product-item"><a href="$1" target="_blank" class="view-details-link">View Details</a></div>'
//     );

//     // Handle type/brand list items
//     message = message.replace(
//       /- (Boots|Boards|Gloves|Hats|BoardRush|ProGear|LiteWear|HeadWarm|GripZone|TrailEdge)/g,
//       '<div class="type-brand-item">- $1</div>'
//     );

//     // Replace newlines with <br> for remaining text
//     message = message.replace(/\n/g, '<br>');

//     return message;
//   }

//   sanitizeMessage(message: string): SafeHtml {
//     return this.sanitizer.bypassSecurityTrustHtml(message);
//   }

//   navigateToProduct(url: string): void {
//     const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
//     if (idMatch) {
//       const route = idMatch[1] === 'shop' ? `/shop/${idMatch[2]}` : `/products/details/${idMatch[2]}`;
//       this.router.navigate([route]);
//     }
//   }
// }

//------============================--------------

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ChatbotService } from '../../core/services/chatbot.service';

interface Chat {
  id: string;
  sender: 'User' | 'Bot';
  message: string;
}

interface Product {
  name: string;
  price: number;
  type: string;
  brand: string;
  quantityInStock: number;
  description: string;
  url: string;
  id: string;
  pictureUrl: string;
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
  userMessage: string = '';
  chatHistory: Chat[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isChatVisible: boolean = false;
  suggestions: string[] = [
    'Show Boots',
    'Show Board',
    'Show Gloves',
    'board price less than 200$',
  ];
  private destroy$ = new Subject<void>();
  private sendMessageSubject = new Subject<string>();

  constructor(
    private chatbotService: ChatbotService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatHistory.push({
      id: this.generateId(),
      sender: 'Bot',
      message:
        'Hello! Welcome to our store. Ask about products, types (Boots, Boards, Gloves, Hats), brands (BoardRush, ProGear, LiteWear, HeadWarm, GripZone, TrailEdge), price, How can I help you?',
    });

    this.sendMessageSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((message) => this.processMessage(message));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isChatVisible = !this.isChatVisible;
    if (this.isChatVisible) {
      setTimeout(() => {
        this.chatInput.nativeElement.focus();
        this.scrollToBottom();
      }, 0);
    }
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.isLoading) {
      this.userMessage = '';
      return;
    }

    const message = this.userMessage.trim();
    this.sendMessageSubject.next(message);
  }

  private processMessage(message: string): void {
    this.chatHistory.push({
      id: this.generateId(),
      sender: 'User',
      message,
    });

    this.userMessage = '';
    this.isLoading = true;
    this.errorMessage = null;
    this.scrollToBottom();

    this.chatbotService
      .sendMessage(message)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.chatHistory.push({
            id: this.generateId(),
            sender: 'Bot',
            message: response.message,
          });
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('❌ Error communicating with the chatbot:', error);
          const errorMsg =
            '❌ Error: Could not connect to the chatbot. Please try again.';
          this.chatHistory.push({
            id: this.generateId(),
            sender: 'Bot',
            message: errorMsg,
          });
          this.isLoading = false;
          this.errorMessage = 'Failed to get a response. Please try again.';
          this.scrollToBottom();
        },
      });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }
    }, 0);
  }

  clearError(): void {
    this.errorMessage = null;
  }

  trackByFn(index: number, chat: Chat): string {
    return chat.id;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  parseProductResponse(message: string): Product | null {
    const productRegex =
      /Name: (.+)\nPrice: \$([\d.]+)\nType: (.+)\nBrand: (.+)\nStock: (\d+)\nDescription: (.+)\nImage: (.+)\nView Details: (.+)/;
    const match = message.match(productRegex);
    if (match) {
      const [
        ,
        name,
        price,
        type,
        brand,
        quantityInStock,
        description,
        pictureUrl,
        url,
      ] = match;
      const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
      return {
        name,
        price: parseFloat(price),
        type,
        brand,
        quantityInStock: parseInt(quantityInStock),
        description,
        pictureUrl,
        url,
        id: idMatch ? idMatch[2] : '',
      };
    }
    return null;
  }

  formatBotMessage(message: string): string {
    // Handle brand details response (e.g., Products by BoardRush)
    const brandDetailsRegex =
      /Products by (.+?):\n((?:- .+?(?:\n  [^\n]+)*?(?=\n- |\n*$|$))+)/g;
    message = message.replace(
      brandDetailsRegex,
      (match, brandName, productsBlock) => {
        let formattedProducts = productsBlock.replace(
          /- (.+)\n  Price: \$?([\d.]+)\n  Type: (.+)\n  Stock: (\d+)(?:\n  Description: (.+)\n  Image: (.+)\n  View Details: (.+))?/gm,
          (
            match: any,
            name: any,
            price: any,
            type: any,
            stock: any,
            description = 'No description available.',
            image = '',
            viewDetails = ''
          ) => {
            return (
              '<div class="product-item">' +
              `<div class="product-name">${
                viewDetails
                  ? `<a href="${viewDetails}" target="_blank" style="color:blue; text-decoration:underline;">${name}</a>`
                  : name
              }</div>` +
              `<div class="product-detail">Price: $${price}</div>` +
              `<div class="product-detail">Type: ${type}</div>` +
              `<div class="product-detail">Stock: ${stock}</div>` +
              '</div>'
            );
          }
        );
        return `<div class="brand-section"><h3 class="brand-title">Products by ${brandName}</h3>${formattedProducts}</div>`;
      }
    );

    // Handle top priced product response (e.g., Top Priced Product:)
    const topPricedRegex =
      /Top Priced Product:\n((?:- .+?(?:\n  [^\n]+)*?(?=\n- |\n*$|$))+)/g;
    message = message.replace(topPricedRegex, (match, productsBlock) => {
      let formattedProducts = productsBlock.replace(
        /- (.+)\n  Price: \$?([\d.]+)\n  Type: (.+)\n  Stock: (\d+)(?:\n  Description: (.+)\n  Image: (.+)\n  View Details: (.+))?/gm,
        (
          match: any,
          name: any,
          price: any,
          type: any,
          stock: any,
          description = 'No description available.',
          image = '',
          viewDetails = ''
        ) => {
          const viewDetailsHtml = viewDetails
            ? `<div class="product-detail"><a href="${viewDetails}" target="_blank"  class="view-details-link">View Details</a></div>`
            : `<div class="product-detail">View Details: Not available</div>`;
          return (
            '<div class="product-item">' +
            `<div class="product-name">${
              viewDetails
                ? `<a href="${viewDetails}" target="_blank" style="color: blue; text-decoration: underline;">${name}</a>`
                : name
            }</div>` +
            `<div class="product-detail">Price: $${price}</div>` +
            `<div class="product-detail">Type: ${type}</div>` +
            `<div class="product-detail">Stock: ${stock}</div>` +
            viewDetailsHtml +
            '</div>'
          );
        }
      );
      return `<div class="brand-section"><h3 class="brand-title">Top Priced Product</h3>${formattedProducts}</div>`;
    });

    // Handle current top priced product response (temporary compatibility)
    const currentTopPricedRegex =
      /The top-priced product in our inventory is the (.+?), which is a (.+?) brand item\. It currently has a stock of (\d+) units\. You can view more details about this product \[here\]\((https?:\/\/[^\s)]+)\)\./g;
    message = message.replace(
      currentTopPricedRegex,
      (match, name, brand, stock, viewDetails) => {
        const price = 'Price not available'; // Placeholder, as price is missing
        const type = 'Boards'; // Hardcoded based on context; update if dynamic
        const description = 'No description available.';
        const image = 'https://localhost:4200/images/products/default.jpg'; // Default image
        return (
          '<div class="brand-section">' +
          '<h3 class="brand-title">Top Priced Product</h3>' +
          '<div class="product-item">' +
          `<div class="product-name"><a href="${viewDetails}" target="_blank" style="color: blue; text-decoration: underline;">${name}</a></div>` +
          `<div class="product-detail">Price: ${price}</div>` +
          `<div class="product-detail">Type: ${type}</div>` +
          `<div class="product-detail">Stock: ${stock}</div>` +
          `<div class="product-detail"><a href="${viewDetails}" target="_blank" class="view-details-link">View Details</a></div>` +
          '</div>' +
          '</div>'
        );
      }
    );

    // Handle generic product list (e.g., Found 2 products by brand BoardRush)
    message = message.replace(
      /- (.+)\s\(\$([\d.]+),\sType:\s(.+),\sBrand:\s(.+),\sStock:\s(\d+)\)\s\[View Details\]\((.+?)\)/g,
      '<div class="product-item">- <a href="$6" target="_blank" style="color: blue; text-decoration: underline;">$1</a> (Price: $2$, Type: $3, Brand: $4, Stock: $5)</div>'
    );

    // Handle standalone View Details links
    message = message.replace(
      /\[View Details\]\((https?:\/\/[^\s)]+)\)/g,
      '<div class="product-item"><a href="$1" target="_blank" class="view-details-link">View Details</a></div>'
    );

    // Handle type/brand list items
    message = message.replace(
      /- (Boots|Boards|Gloves|Hats|BoardRush|ProGear|LiteWear|HeadWarm|GripZone|TrailEdge)/g,
      '<div class="type-brand-item">- $1</div>'
    );

    // Replace newlines with <br> for remaining text
    message = message.replace(/\n/g, '<br>');

    return message;
  }

  sanitizeMessage(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }

  navigateToProduct(url: string): void {
    const idMatch = url.match(/\/(products\/details|shop)\/(\d+)/);
    if (idMatch) {
      const route =
        idMatch[1] === 'shop'
          ? `/shop/${idMatch[2]}`
          : `/products/details/${idMatch[2]}`;
      this.router.navigate([route]);
    }
  }
}
