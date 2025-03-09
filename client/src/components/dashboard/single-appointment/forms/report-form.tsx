/**
 * ReportForm component that allows users to create or edit a report.
 * It includes inputs for title, items, user, type, parts, links, and a checkbox for approvalNeeded.
 * It also provides action buttons for submitting or canceling.
 */
import * as React from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ItemForm } from './item-form';
import { useNavigate } from 'react-router-dom';
import type { Report, ReportItem } from '@/types/report';

interface ReportFormProps {
  loading: boolean;
  report: Report;
  setReport: React.Dispatch<React.SetStateAction<Report>>;
  sendReportToDatabase: (e: React.FormEvent) => void;
  formType: string;
}

export function ReportForm({
  loading,
  report,
  setReport,
  sendReportToDatabase,
  formType,
}: ReportFormProps): React.JSX.Element {
  const navigate = useNavigate();

  // Update report type based on formType prop
  React.useEffect(() => {
    setReport((prev) => ({ ...prev, type: formType }));
  }, [formType, setReport]);

  const addNewItem = () => {
    const newItem: ReportItem = { description: '', costCode: '', images: [] };
    setReport((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (index: number, updatedItem: ReportItem) => {
    const newItems = [...report.items];
    newItems[index] = updatedItem;
    setReport((prev) => ({ ...prev, items: newItems }));
  };

  const removeItem = (index: number) => {
    const newItems = report.items.filter((_, i) => i !== index);
    setReport((prev) => ({ ...prev, items: newItems }));
  };

  // Cancel button returns to reports table
  const handleCancel = () => {
    navigate('/reports');
  };

  return (
    <Box sx={{ p: { sm: 0, md: 3 } }}>
      <Stack spacing={3}>
        {/* Report Title Input */}
        <Box>
          <TextField
            label="Report Title"
            fullWidth
            value={report.title}
            onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))}
          />
        </Box>
        {/* Items Section */}
        <Stack spacing={2}>
          {report.items.map((item, index) => (
            <ItemForm
              key={index}
              item={item}
              itemIndex={index}
              onUpdate={(updatedItem) => updateItem(index, updatedItem)}
              onRemove={() => removeItem(index)}
            />
          ))}
          <Button variant="outlined" onClick={addNewItem}>
            Add Item
          </Button>
        </Stack>
        {/* Additional Fields */}
        <Box>
          <TextField
            label="User"
            fullWidth
            value={report.user}
            onChange={(e) => setReport((prev) => ({ ...prev, user: e.target.value }))}
          />
        </Box>
        <Box>
          <TextField
            label="Type"
            fullWidth
            value={report.type}
            onChange={(e) => setReport((prev) => ({ ...prev, type: e.target.value }))}
          />
        </Box>
        <Box>
          <TextField
            label="Parts (optional)"
            fullWidth
            value={report.parts}
            onChange={(e) => setReport((prev) => ({ ...prev, parts: e.target.value }))}
          />
        </Box>
        <Box>
          <TextField
            label="Links (comma separated, optional)"
            fullWidth
            value={report.links.join(',')}
            onChange={(e) =>
              setReport((prev) => ({
                ...prev,
                links: e.target.value.split(',').map((link) => link.trim()).filter((link) => link),
              }))
            }
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={report.approvalNeeded}
                onChange={(e) =>
                  setReport((prev) => ({ ...prev, approvalNeeded: e.target.checked }))
                }
              />
            }
            label="Approval Needed"
          />
        </Box>
        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button disabled={loading} onClick={sendReportToDatabase} size="large" variant="outlined" fullWidth>
            {loading ? 'Loading...' : 'Upload Report'}
          </Button>
          <Button disabled={loading} onClick={handleCancel} size="large" variant="outlined" fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}