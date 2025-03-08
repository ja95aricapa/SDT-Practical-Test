// client/src/pages/reports.tsx
import React, { useEffect, useState } from 'react';
import { getReports, deleteReport } from '@/services/reports';
import { Box, Button, Typography, List, ListItem, ListItemText, Stack } from '@mui/material';
import { RouterLink } from '@/components/core/link';

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
      <Typography variant="h4" gutterBottom>
        Reports List
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
        <List>
          {reports.map((report) => (
            <ListItem key={report._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText
                primary={report.title}
                secondary={new Date(report.createdAt).toLocaleString()}
              />
              <Box>
                <Button component={RouterLink} href={`/report/${report._id}`} variant="outlined" sx={{ mr: 1 }}>
                  View / Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(report._id)}>
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}