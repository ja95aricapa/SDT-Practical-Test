/**
 * New Report page where users can create a report.
 * It uses the ReportForm component and sends data via createReport API call.
 */
import * as React from 'react';
import { ReportForm } from '@/components/dashboard/single-appointment/forms/report-form';
import { createReport } from '@/services/reports';
import { useNavigate } from 'react-router-dom';
import type { Report } from '@/types/report';

/**
 * Generates a 24-character ObjectId (similar to MongoDB ObjectId).
 */
function generateObjectId(): string {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.floor(Math.random() * 16)).toString(16))
  ).toLowerCase();
}

export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<Report>({
    issueId: generateObjectId(),
    createdAt: new Date(),
    title: '',
    description: '',
    items: [],
    type: '',
    parts: '',
    links: [],
    // Generates a valid ObjectId for "user"
    user: generateObjectId(),
    approvalNeeded: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure issueId exists
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
    <div style={{ padding: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
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