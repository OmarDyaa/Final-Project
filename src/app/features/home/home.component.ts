import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IsUserDirective } from '../../shared/directives/is-user.directive';
import { IsLoggedOutDirective } from '../../shared/directives/is-loggedout.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IsUserDirective, IsLoggedOutDirective, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
