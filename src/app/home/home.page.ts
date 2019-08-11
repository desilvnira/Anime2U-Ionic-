import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
/**
 * Basic Home page which displays the logo.
 * Gives user to options to login or register
 */
export class HomePage implements OnInit {

  constructor(public router: Router) {
    
  }

  ngOnInit() {
    
  }

  /**
   * Navigates user to login page
   */
  login(){   
    this.router.navigate(['/login'])    
  }

  /**
   * Navigates user to register page
   */
  register(){
    this.router.navigate(['/register'])
  }

}
