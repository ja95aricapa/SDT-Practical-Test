import * as React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ItemForm } from './item-form'

// Interfaces for a report item and the full report
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
  // Update report type when formType changes
  React.useEffect(() => {
    setReport((prev) => ({ ...prev, type: formType }));
  }, [formType, setReport]);

  // Add a new empty item to the report
  const addNewItem = () => {
    const newItem = { description: '', costCode: '', images: [] };
    setReport((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  // Update an existing item based on its index
  const updateItem = (index: number, updatedItem: ReportItem) => {
    const newItems = [...report.items];
    newItems[index] = updatedItem;
    setReport((prev) => ({ ...prev, items: newItems }));
  };

  // Remove an item from the report
  const removeItem = (index: number) => {
    const newItems = report.items.filter((_, i) => i !== index);
    setReport((prev) => ({ ...prev, items: newItems }));
  };

  return (
    <Box sx={{ p: { sm: 0, md: 3 } }}>
      <Stack spacing={3}>
        {/* Title Input */}
        <Box>
          <input
            type="text"
            placeholder="Report Title"
            value={report.title}
            onChange={(e) => setReport((prev) => ({ ...prev, title: e.target.value }))}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
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

        {/* Additional Fields (Optional) */}
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
                links: e.target.value.split(',').map((link) => link.trim()).filter((link) => link)
              }))
            }
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </Box>

        <Button disabled={loading} onClick={sendReportToDatabase} size="large" variant="outlined" fullWidth>
          {loading ? 'Loading...' : 'Upload Report'}
        </Button>
      </Stack>
    </Box>
  );
}
