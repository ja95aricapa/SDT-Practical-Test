import React, { useEffect, useState } from 'react';
import { getReports, deleteReport } from '@/services/reports';
import { Box, Button, Stack, Typography } from '@mui/material';
import { RouterLink } from '@/components/core/link';
import { ReportsTable } from '@/components/dashboard/single-appointment/tables/ReportsTable';

export function ReportsPage(): React.JSX.Element {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getReports();
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports', error);
      alert('Error fetching reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      fetchReports();
    } catch (error) {
      console.error('Error deleting report', error);
      alert('Error deleting report.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button component={RouterLink} href="/" variant="outlined">
          Return Home
        </Button>
        <Button component={RouterLink} href="/NewReport" variant="contained">
          Create New Report
        </Button>
        <Button onClick={fetchReports} variant="outlined">
          Refresh
        </Button>
      </Stack>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <ReportsTable reports={reports} onDelete={handleDelete} />
      )}
    </Box>
  );
}