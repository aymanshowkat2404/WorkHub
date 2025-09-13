import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})

export class PricingComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.initPricingToggle();
    this.initFAQAccordion();
  }

  initPricingToggle(): void {
    const toggle = document.getElementById('pricingToggle') as HTMLInputElement;
    if (toggle) {
      toggle.addEventListener('change', () => {
        this.updatePrices(toggle.checked);
      });
    }
  }

  updatePrices(isAnnual: boolean): void {
    const basicPrice = document.getElementById('basicPrice');
    const proPrice = document.getElementById('proPrice');
    const enterprisePrice = document.getElementById('enterprisePrice');
    
    if (basicPrice && proPrice && enterprisePrice) {
      if (isAnnual) {
        basicPrice.textContent = '15';
        proPrice.textContent = '39';
        enterprisePrice.textContent = '79';
      } else {
        basicPrice.textContent = '19';
        proPrice.textContent = '49';
        enterprisePrice.textContent = '99';
      }
    }
  }

  initFAQAccordion(): void {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          item.classList.toggle('active');
        });
      }
    });
  }
}