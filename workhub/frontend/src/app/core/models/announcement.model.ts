export interface Announcement {
    id: number;
    title: string;
    content: string;
    postedBy: string;
    postedDate: string; // ISO date string
    isPinned: boolean;
  }
  