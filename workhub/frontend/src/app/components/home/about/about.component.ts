import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.animateStats();
  }

  animateStats(): void {
    const companies = document.getElementById('companiesCount');
    const employees = document.getElementById('employeesCount');
    const uptime = document.getElementById('uptimeCount');
    const support = document.getElementById('supportCount');
    
    if (companies && employees && uptime && support) {
      this.animateValue(companies, 0, 500, 2000);
      this.animateValue(employees, 0, 25000, 2000);
      this.animateValue(uptime, 0, 99.9, 2000);
      this.animateValue(support, 0, 10000, 2000);
    }
  }

  animateValue(element: HTMLElement, start: number, end: number, duration: number): void {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      
      if (end === 99.9) {
        element.innerHTML = value.toFixed(1) + (progress < 1 ? '' : '%');
      } else {
        element.innerHTML = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (progress < 1 ? '' : '+');
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}