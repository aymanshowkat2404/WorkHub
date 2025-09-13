import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-support',
  standalone: false,
  templateUrl: './employee-support.component.html',
  styleUrl: './employee-support.component.css'
})
export class EmployeeSupportComponent implements OnInit {
  isSidebarActive = false;
  activeTab = 'raise-ticket';
  notificationCount = 3;
  
  ticket = {
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachment: null
  };

  faqs = [
    {
      question: 'How do I request time off?',
      answer: 'You can request time off through the Leave Management section in WorkHub. Navigate to "Leave Management" in the sidebar, click "Request Leave," fill out the form with your dates and reason, and submit. Your manager will be notified for approval.',
      active: false
    },
    {
      question: 'When will I receive my payslip?',
      answer: 'Payslips are typically available by the 5th of each month for the previous month\'s salary. You can access them under "Salary/Payslips" in the sidebar. If you don\'t see your payslip by the 7th, please contact HR.',
      active: false
    },
    {
      question: 'How do I update my personal information?',
      answer: 'Go to "My Profile" in the sidebar. Click "Edit" next to the section you want to update (contact details, emergency contacts, etc.). Note that some information (like legal name) may require HR verification.',
      active: false
    },
    {
      question: 'What benefits am I eligible for?',
      answer: 'Benefit eligibility depends on your employment type and tenure. Common benefits include health insurance (after 30 days), 401(k) matching (after 90 days), and PTO accrual. For specifics, check the "Benefits" section or contact HR.',
      active: false
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, or contact IT support at it-help@company.com. You\'ll receive an email with reset instructions. Note: HR cannot reset passwords for security reasons.',
      active: false
    }
  ];

  hrContacts = [
    {
      name: 'Emily Rodriguez',
      position: 'HR Generalist',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      email: 'emily.rodriguez@company.com',
      phone: 'Ext. 4567',
      responsibilities: 'Payroll, Benefits, Onboarding'
    },
    {
      name: 'Michael Chen',
      position: 'HR Manager',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      email: 'michael.chen@company.com',
      phone: 'Ext. 1234',
      responsibilities: 'Policy, Employee Relations, Escalations'
    },
    {
      name: 'Jessica Williams',
      position: 'Recruiter',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      email: 'jessica.williams@company.com',
      phone: 'Ext. 7890',
      responsibilities: 'Hiring, Referrals, Internships'
    },
    {
      name: 'David Kim',
      position: 'IT Support',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      email: 'it-help@company.com',
      phone: 'Ext. 5555',
      responsibilities: 'System Access, Technical Issues'
    }
  ];

  ngOnInit() {
    // Initialize component if needed
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  toggleNotifications() {
    // Implement notification logic here
    console.log('Notifications toggled');
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  toggleFaq(faq: any) {
    faq.active = !faq.active;
  }

  onFileSelected(event: any) {
    this.ticket.attachment = event.target.files[0];
  }

  submitTicket() {
    // Implement ticket submission logic here
    console.log('Submitting ticket:', this.ticket);
    // Reset form after submission
    this.ticket = {
      subject: '',
      category: '',
      priority: 'medium',
      description: '',
      attachment: null
    };
  }

  cancelTicket() {
    // Reset form
    this.ticket = {
      subject: '',
      category: '',
      priority: 'medium',
      description: '',
      attachment: null
    };
  }
}

