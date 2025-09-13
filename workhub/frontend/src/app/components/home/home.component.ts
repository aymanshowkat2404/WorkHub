import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    // Stats counter animation
    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter('companiesCount', 250);
          this.animateCounter('employeesCount', 12500);
          this.animateCounter('uptimeCount', 99.9);
          this.animateCounter('supportCount', 980);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsSection) {
      observer.observe(statsSection);
    }

    // Testimonial slider
    this.initTestimonialSlider();
  }

  animateCounter(elementId: string, target: number, duration = 2000): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const counter = () => {
      current += increment;
      if (current < target) {
        if (target % 1 === 0) {
          element.textContent = Math.floor(current).toString();
        } else {
          element.textContent = current.toFixed(1);
        }
        requestAnimationFrame(counter);
      } else {
        if (target % 1 === 0) {
          element.textContent = target.toString();
        } else {
          element.textContent = target.toFixed(1);
        }
      }
    };
    counter();
  }

  initTestimonialSlider(): void {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval: any;

    function showSlide(n: number): void {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide(): void {
      showSlide(currentSlide + 1);
    }

    function startSlider(): void {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function pauseSlider(): void {
      clearInterval(slideInterval);
    }

    // Start auto-advance
    startSlider();

    // Pause on hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', pauseSlider);
      slider.addEventListener('mouseleave', startSlider);
    }

    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide') || '0');
        showSlide(slideIndex);
        // Reset timer
        clearInterval(slideInterval);
        startSlider();
      });
    });
  }
}