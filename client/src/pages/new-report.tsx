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
  issueId: string;
  createdAt: Date;
  title: string;
  items: ReportItem[];
  type: string;
  parts: string;
  links: string[];
  user: string;
  approvalNeeded: boolean | null;
}

/**
 * Generates a random 24-character hexadecimal string
 * similar to a MongoDB ObjectId.
 */
function generateObjectId(): string {
  // Get current timestamp in seconds and convert to hex
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  // Append 16 random hexadecimal characters
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      (Math.floor(Math.random() * 16)).toString(16)
    )
  ).toLowerCase();
}

export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<Report>({
    issueId: generateObjectId(),
    createdAt: new Date(),
    title: '',
    items: [],
    type: '',
    parts: '',
    links: [],
    user: generateObjectId(), // Ahora se genera un ObjectId válido para "user"
    approvalNeeded: false,
  });

  // Before submitting, ensure issueId is generated
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If issueId is missing, generate one
    if (!report.issueId) {
      setReport((prev) => ({ ...prev, issueId: generateObjectId() }));
    }
    try {
      setLoading(true);
      await createReport(report);
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