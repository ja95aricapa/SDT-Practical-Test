// client/src/types/report.ts
export interface ReportItem {
    description: string;
    costCode: string;
    images: File[];
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
  