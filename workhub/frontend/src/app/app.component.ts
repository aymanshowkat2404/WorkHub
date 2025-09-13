import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = 'WorkHub';
  showSidebar = false;
  showEmployeeSidebar = false; // Declare the property
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showEmployeeSidebar = this.router.url.startsWith('/employee');
    });
  }
}
