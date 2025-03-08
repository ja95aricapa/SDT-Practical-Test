import * as React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ItemForm } from './item-form';
import { useNavigate } from 'react-router-dom';

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
    const newItem = { description: '', costCode: '', images: [] };
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
        <Box>
          <input
            type="text"
            placeholder="Report Title"
            value={report.title}
            onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </Box>
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
        <Box>
          <input
            type="text"
            placeholder="Parts (optional)"
            value={report.parts}
            onChange={(e) => setReport((prev) => ({ ...prev, parts: e.target.value }))}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </Box>
        <Box>
          <input
            type="text"
            placeholder="Links (comma separated, optional)"
            value={report.links.join(',')}
            onChange={(e) =>
              setReport((prev) => ({
                ...prev,
                links: e.target.value.split(',').map((link) => link.trim()).filter((link) => link),
              }))
            }
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </Box>
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