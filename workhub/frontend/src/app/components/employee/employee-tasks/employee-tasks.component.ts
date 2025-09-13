import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-tasks',
  standalone: false,
  templateUrl: './employee-tasks.component.html',
  styleUrl: './employee-tasks.component.css'
})
export class EmployeeTasksComponent implements OnInit {
  mobileMenuOpen = false;
  showModal = false;
  
  // Task Filters
  taskFilters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'assigned', label: 'Assigned to Me' },
    { value: 'high', label: 'High Priority' },
    { value: 'due', label: 'Due Soon' },
    { value: 'completed', label: 'Completed' }
  ];
  activeFilter = 'all';
  searchQuery = '';
  
  // Selected Task for Modal
  selectedTask: any = {
    status: 'completed',
    completionNotes: '',
    files: [],
    externalLinks: ''
  };
  
  // Tasks Data
  tasks = [
    {
      id: 1,
      title: 'Complete Project Documentation',
      priority: 'high',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      project: 'Website Redesign',
      description: 'Prepare comprehensive documentation for the website redesign project including all technical specifications, API documentation, and user guides.',
      progress: 65,
      assignedToMe: true,
      attachments: [
        { name: 'Documentation_Template.docx', type: 'word' },
        { name: 'Style_Guide.pdf', type: 'pdf' }
      ],
      comments: [
        {
          author: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          time: '2 hours ago',
          text: 'Please make sure to include the API endpoints documentation as we discussed in yesterday\'s meeting.'
        }
      ],
      newComment: ''
    },
    {
      id: 2,
      title: 'Code Review for New Feature',
      priority: 'medium',
      dueDate: new Date('2025-06-25'),
      project: 'Customer Portal',
      description: 'Review the new authentication module code submitted by the junior developers. Provide feedback and suggestions for improvement.',
      progress: 30,
      attachments: [],
      comments: [],
      assignedToMe: false, 
      newComment: ''
    },
    {
      id: 3,
      title: 'Prepare Client Meeting Agenda',
      priority: 'low',
      dueDate: new Date('2025-07-05'),
      project: 'Acme Corp',
      description: 'Create a detailed agenda for the upcoming client meeting covering project milestones, challenges, and next steps.',
      progress: 15,
      attachments: [],
      comments: [],
      assignedToMe: false, 
      newComment: ''
    },
    {
      id: 4,
      title: 'Update Test Cases',
      priority: 'medium',
      dueDate: new Date('2025-06-28'),
      project: 'Inventory System',
      description: 'Review and update all test cases for the inventory management module to reflect recent changes in requirements.',
      progress: 45,
      assignedToMe: false, 
      attachments: [
        { name: 'Test_Cases.xlsx', type: 'excel' }
      ],
      comments: [],
      newComment: ''
    }
  ];
  
  // Filtered Tasks
  filteredTasks = [...this.tasks];

  ngOnInit() {
    this.filterTasks();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  // Task Filtering
  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    this.filterTasks();
  }
  
  filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      // Apply active filter
      const filterMatch = 
        this.activeFilter === 'all' ||
        (this.activeFilter === 'high' && task.priority === 'high') ||
        (this.activeFilter === 'medium' && task.priority === 'medium') ||
        (this.activeFilter === 'low' && task.priority === 'low') ||
        (this.activeFilter === 'assigned' && task.assignedToMe) ||
        (this.activeFilter === 'due' && this.isDueSoon(task.dueDate)) ||
        (this.activeFilter === 'completed' && task.progress === 100);
      
      // Apply search query
      const searchMatch = 
        !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return filterMatch && searchMatch;
    });
  }
  
  isDueSoon(dueDate: Date): boolean {
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3; // Due in 3 days or less
  }
  
  // Task Modal
  openTaskModal(task: any) {
    this.selectedTask = { ...task, files: [], externalLinks: '' };
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeTaskModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }
  
  onModalClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeTaskModal();
    }
  }
  
  submitTask() {
    // In a real app, would submit to backend
    const taskIndex = this.tasks.findIndex(t => t.id === this.selectedTask.id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].progress = this.selectedTask.status === 'completed' ? 100 : this.tasks[taskIndex].progress;
    }
    this.closeTaskModal();
  }
  
  // File Upload
  triggerFileUpload() {
    // This would be handled by the file input click in the template
    alert('File upload dialog would open here');
  }
  
  handleFileUpload(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = this.getFileType(file.name);
      this.selectedTask.files.push({
        name: file.name,
        type: fileType
      });
    }
  }
  
  removeFile(file: any) {
    this.selectedTask.files = this.selectedTask.files.filter((f: any) => f.name !== file.name);
  }
  
  // Task Progress Update
  updateTaskProgress(task: any) {
    const newProgress = prompt('Enter new progress percentage (0-100):', task.progress.toString());
    if (newProgress !== null) {
      const progress = parseInt(newProgress, 10);
      if (!isNaN(progress) && progress >= 0 && progress <= 100) {
        task.progress = progress;
      } else {
        alert('Please enter a valid number between 0 and 100');
      }
    }
  }
  
  // Comments
  addComment(task: any) {
    if (task.newComment.trim()) {
      task.comments.push({
        author: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        time: 'Just now',
        text: task.newComment
      });
      task.newComment = '';
    }
  }
  
  // Helper Functions
  getFileIcon(fileType: string): string {
    const icons: {[key: string]: string} = {
      'pdf': 'fas fa-file-pdf',
      'word': 'fas fa-file-word',
      'excel': 'fas fa-file-excel',
      'powerpoint': 'fas fa-file-powerpoint',
      'image': 'fas fa-file-image',
      'default': 'fas fa-file'
    };
    
    return icons[fileType] || icons['default'];
  }
  
  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'word';
      case 'xls':
      case 'xlsx': return 'excel';
      case 'ppt':
      case 'pptx': return 'powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      default: return 'default';
    }
  }
}

