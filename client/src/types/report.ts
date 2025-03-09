/**
 * Defines TypeScript types for Report and ReportItem.
 */
export interface ReportItem {
    description: string;
    costCode: string;
    images: File[]; // You might later adjust this type if you store image URLs, keys, etc.
  }
  
  export interface Report {
    issueId: string;
    createdAt: Date;
    title: string;
    description: string;
    items: ReportItem[];
    type: string;
    parts: string;
    links: string[];
    user: string;
    approvalNeeded: boolean;
  }  