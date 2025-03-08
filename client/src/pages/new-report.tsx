// client/src/pages/new-report.tsx
import * as React from 'react';
import { ReportForm } from '@/components/dashboard/single-appointment/forms/report-form';
import { createReport } from '@/services/reports';
import { useNavigate } from 'react-router-dom';

// Interfaces compartidas para el reporte
export interface ReportItem {
  description: string;
  costCode: string;
  images: File[];
}

export interface Report {
  createdAt: Date;
  title: string;
  items: ReportItem[];
  type: string;
  parts: string;
  links: string[];
  user: string;
  approvalNeeded: boolean | null;
}

export function Page(): React.JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<Report>({
    createdAt: new Date(),
    title: '',
    items: [],
    type: '',
    parts: '',
    links: [],
    user: 'userId',
    approvalNeeded: false,
  });
  const navigate = useNavigate();

  // Handle report submission by calling the API and navigating to the reports list
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createReport(report);
      alert('Report created successfully.');
      navigate('/reports');
    } catch (error) {
      console.error('Error creating report', error);
      alert('Error creating report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Create New Report</h1>
        <ReportForm
          formType="Other"
          loading={loading}
          report={report}
          setReport={setReport}
          sendReportToDatabase={handleSubmit}
        />
      </div>
    </div>
  );
}