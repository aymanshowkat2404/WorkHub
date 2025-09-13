import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface Skill {
  id: string;
  name: string;
}

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Profile {
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  employeeId: string;
  department: string;
  manager: string;
  email: string;
  phone: string;
  joinDate: string;
  about: string;
  skills: Skill[];
  experience: Experience[];
}

@Component({
  standalone: false,
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  mobileMenuOpen = false;
  newSkill = '';
  profile: Profile = {
    avatar: '',
    name: 'Ayman Showkat',
    firstName: 'Ayman',
    lastName: 'Showkat',
    title: 'Software Engineer',
    employeeId: 'EMP-2048',
    department: 'engineering',
    manager: 'sarah',
    email: 'abc@company.com',
    phone: '(555) 123-4567',
    joinDate: '2020-06-15',
    about: 'Senior software engineer with 8+ years of experience in full-stack development. Specializes in JavaScript frameworks (React, Angular, Node.js) and cloud architecture. Passionate about building scalable web applications and mentoring junior developers.',
    skills: [
      { id: 'javascript', name: 'JavaScript' },
      { id: 'react', name: 'React' },
      { id: 'node', name: 'Node.js' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'aws', name: 'AWS' }
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechSolutions Inc.',
        startDate: '2020-06-01',
        endDate: '',
        description: 'Lead developer for the company\'s flagship SaaS product. Architected and implemented microservices infrastructure that improved system reliability by 40%. Mentored 5 junior developers through code reviews and pair programming.'
      },
      {
        title: 'Software Engineer',
        company: 'Digital Innovations Co.',
        startDate: '2016-08-15',
        endDate: '2020-05-31',
        description: 'Developed and maintained customer-facing web applications using React and Node.js. Collaborated with UX designers to implement responsive interfaces. Reduced page load times by 30% through performance optimizations.'
      }
    ]
  };

  departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' }
  ];

  managers = [
    { value: 'sarah', label: 'Sarah Johnson' },
    { value: 'michael', label: 'Michael Chen' },
    { value: 'lisa', label: 'Lisa Rodriguez' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateFullName();
  }

  updateFullName(): void {
    this.profile.name = `${this.profile.firstName} ${this.profile.lastName}`;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  addSkill(): void {
    if (this.newSkill.trim()) {
      const skillId = this.newSkill.toLowerCase().replace(/\s+/g, '-');
      this.profile.skills.push({
        id: skillId,
        name: this.newSkill.trim()
      });
      this.newSkill = '';
    }
  }

  removeSkill(skill: Skill): void {
    this.profile.skills = this.profile.skills.filter(s => s.id !== skill.id);
  }

  addExperience(): void {
    this.profile.experience.push({
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  removeExperience(index: number): void {
    this.profile.experience.splice(index, 1);
  }

  onSubmit(): void {
    this.saveProfile();
  }

  saveProfile(): void {
    // In a real app, you would call a service to save the profile
    alert('Profile changes saved successfully!');
    this.router.navigate(['/employee']);
  }

  discardChanges(): void {
    if (confirm('Are you sure you want to discard all changes?')) {
      this.router.navigate(['/employee']);
    }
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      // In a real app, you would call a service to delete the profile
      alert('Profile deleted successfully.');
      this.router.navigate(['/employee']);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 992) {
      this.mobileMenuOpen = false;
    }
  }
}