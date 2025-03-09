/**
 * Report Detail page for editing an existing report.
 * It fetches the report by id and uses the ReportForm for updating.
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReportById, updateReport } from '@/services/reports';
import { Box, Typography } from '@mui/material';
import { ReportForm } from '@/components/dashboard/single-appointment/forms/report-form';

export function ReportDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch report by id
  const fetchReport = async () => {
    if (id) {
      setLoading(true);
      try {
        const response = await getReportById(id);
        setReport(response.data.report);
      } catch (error) {
        console.error('Error fetching report', error);
        alert('Error fetching report.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && report) {
      try {
        setLoading(true);
        await updateReport(id, report);
        alert('Report updated successfully.');
      } catch (error) {
        console.error('Error updating report', error);
        alert('Error updating report.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || !report) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Report
      </Typography>
      <ReportForm
        formType={report.type || 'Other'}
        loading={loading}
        report={report}
        setReport={setReport}
        sendReportToDatabase={handleUpdate}
      />
    </Box>
  );
}