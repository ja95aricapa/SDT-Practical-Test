import * as React from 'react';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Uploader } from '@/components/dashboard/single-appointment/uploader';

export interface ReportItem {
  description: string;
  costCode: string;
  images: File[];
}

interface ItemFormProps {
  item: ReportItem;
  itemIndex: number;
  onUpdate: (updatedItem: ReportItem) => void;
  onRemove: () => void;
}

export function ItemForm({ item, itemIndex, onUpdate, onRemove }: ItemFormProps): React.JSX.Element {
  const [localItem, setLocalItem] = React.useState<ReportItem>(item);

  const handleFieldChange = (field: keyof ReportItem, value: string | File[]) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onUpdate(updatedItem);
  };

  return (
    <Box sx={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Item {itemIndex + 1}</Typography>
        <IconButton onClick={onRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </Stack>
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={localItem.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
      />
      <TextField
        label="Cost Code"
        fullWidth
        margin="normal"
        value={localItem.costCode}
        onChange={(e) => handleFieldChange('costCode', e.target.value)}
      />
      <Uploader
        report={{ images: localItem.images }}
        setReport={(updated) => handleFieldChange('images', updated.images)}
      />
    </Box>
  );
}
