// client/src/components/dashboard/single-appointment/forms/report-form.tsx
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

  // Función para cancelar y volver a la lista de reportes
  const handleCancel = () => {
    navigate('/reports');
  };

  return (
    <Box sx={{ p: { sm: 0, md: 3 } }}>
      <Stack spacing={3}>
        {/* Report Title */}
        <Box>
          <TextField
            label="Report Title"
            fullWidth
            value={report.title}
            onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))}
          />
        </Box>
        {/* Report Description */}
        <Box>
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={report.description}
            onChange={(e) => setReport((prev) => ({ ...prev, description: e.target.value }))}
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
        {/* Botones de acción */}
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