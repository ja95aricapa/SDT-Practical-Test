import * as React from 'react';
import {ReportForm} from '@/components/dashboard/single-appointment/forms/report-form';

interface Report {
  createdAt: Date;
  title: string;
  description: string;
  images: string[];
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
    description: '',
    images: [],
    type: '',
    parts: '',
    links: [],
    user: 'userId',
    approvalNeeded: null,
  });

  React.useEffect(() => {
    console.log('Report:', report);
  },  [report]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE TO CANDIDATE: 
    // This is where you would send the report to the database, implement logic
    console.log('Report submitted:', { title, description, content });
  };

  return (
    <div style={{ padding: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ textAlign: 'center' }}>Create New Report</h1>
        <ReportForm
          formType={'Other'}
          loading={loading}
          report={report}
          sendReportToDatabase={() => handleSubmit}
          setReport={setReport}
        />
      </div>
    </div>
  );
}
