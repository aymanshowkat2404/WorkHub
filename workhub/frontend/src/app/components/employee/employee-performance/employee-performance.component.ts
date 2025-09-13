import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-performance',
  standalone: false,
  templateUrl: './employee-performance.component.html',
  styleUrl: './employee-performance.component.css'
})
export class EmployeePerformanceComponent implements OnInit {
  isSidebarActive = false;
  activeTab = 'reports';
  notificationCount = 3;
  
  selectedPeriod = 'all';
  selectedYear = '2025';
  availableYears = ['2025', '2024', '2023'];
  
  reports = [
    {
      id: 1,
      type: 'Quarterly',
      period: 'Q2 2025',
      metrics: [
        { name: 'Productivity', value: 4.2 },
        { name: 'Quality of Work', value: 4.5 },
        { name: 'Team Collaboration', value: 3.8 },
        { name: 'Initiative', value: 4.0 }
      ]
    },
    {
      id: 2,
      type: 'Monthly',
      period: 'May 2025',
      metrics: [
        { name: 'Productivity', value: 4.0 },
        { name: 'Quality of Work', value: 4.3 },
        { name: 'Deadline Adherence', value: 3.5 },
        { name: 'Communication', value: 4.1 }
      ]
    },
    {
      id: 3,
      type: 'Quarterly',
      period: 'Q1 2025',
      metrics: [
        { name: 'Productivity', value: 3.9 },
        { name: 'Quality of Work', value: 4.0 },
        { name: 'Problem Solving', value: 4.2 },
        { name: 'Learning & Growth', value: 3.7 }
      ]
    }
  ];
  
  filteredReports = [...this.reports];
  
  feedbacks = [
    {
      id: 1,
      manager: {
        name: 'Sarah Johnson',
        position: 'Engineering Manager',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      date: new Date('2025-06-15'),
      category: 'Quarterly Review',
      text: [
        'John has shown excellent progress this quarter in his technical skills and project contributions. His work on the authentication module was particularly impressive, demonstrating strong problem-solving abilities and attention to security best practices.',
        'One area for improvement would be to take more initiative in mentoring junior team members, as his knowledge would be valuable to share with others.'
      ],
      ratings: [
        { label: 'Technical Skills', value: 5 },
        { label: 'Teamwork', value: 3 },
        { label: 'Communication', value: 4 }
      ]
    },
    {
      id: 2,
      manager: {
        name: 'Sarah Johnson',
        position: 'Engineering Manager',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      date: new Date('2025-03-28'),
      category: 'Project Feedback',
      text: [
        'John\'s performance on the inventory system project was solid. He met all deadlines and delivered quality code. His documentation could be more detailed to help other team members understand his implementations more quickly.',
        'I appreciate John\'s willingness to take on additional tasks when needed. He showed good adaptability when requirements changed mid-sprint.'
      ],
      ratings: [
        { label: 'Quality of Work', value: 4 },
        { label: 'Deadline Adherence', value: 5 },
        { label: 'Documentation', value: 3 }
      ]
    }
  ];
  
  selfAssessment = {
    accomplishments: '',
    improvements: '',
    skills: [
      { name: 'Technical Skills', value: 3 },
      { name: 'Communication', value: 3 },
      { name: 'Leadership', value: 3 }
    ],
    goals: '',
    support: ''
  };

  ngOnInit() {
    this.filterReports();
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

  filterReports() {
    if (this.selectedPeriod === 'all') {
      this.filteredReports = this.reports.filter(report => 
        report.period.includes(this.selectedYear))
    } else {
      this.filteredReports = this.reports.filter(report => 
        report.type.toLowerCase() === this.selectedPeriod && 
        report.period.includes(this.selectedYear))
    }
  }

  exportAllReports() {
    // Implement export logic here
    console.log('Exporting all reports');
  }

  viewReportDetails(report: any) {
    // Implement view details logic here
    console.log('Viewing report details', report);
  }

  downloadReport(report: any) {
    // Implement download logic here
    console.log('Downloading report', report);
  }

  getProgressClass(value: number): string {
    if (value >= 4.5) return 'progress-excellent';
    if (value >= 4.0) return 'progress-good';
    if (value >= 3.0) return 'progress-average';
    return 'progress-poor';
  }

  getStars(count: number): string {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  }

  updateSlider(event: any, index: number) {
    const value = (event.target.value - event.target.min) / (event.target.max - event.target.min) * 100;
    event.target.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${value}%, #eee ${value}%, #eee 100%)`;
  }

  saveDraft() {
    // Implement save draft logic here
    console.log('Saving draft', this.selfAssessment);
  }

  submitAssessment() {
    // Implement submit assessment logic here
    console.log('Submitting assessment', this.selfAssessment);
  }


}
