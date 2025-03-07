import * as React from 'react';
import type { JSX } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';

import { TextEditor } from '@/components/core/text-editor-report-form/text-editor';
import { Uploader } from '@/components/dashboard/single-appointment/uploader';
import { useFormHook } from './form-hooks';

interface ReportFormProps {
  report: Report;
  setReport: React.Dispatch<React.SetStateAction<Report>>;
}

export function GeneralForm({ report, setReport }: ReportFormProps): JSX.Element {

  const {
    handleFieldChange,
  } = useFormHook({ report, setReport });

  return (
    <>
      <FormControl>
        <InputLabel shrink htmlFor="description-editor">
          Job Description <span style={{ fontWeight: 'lighter' }}>(required)</span>
        </InputLabel>
        <Box sx={{ mt: '8px', '& .tiptap-container': { minHeight: '8rem' } }}>
          <TextEditor
            content={report.description || ''}
            onUpdate={(content) => {
              handleFieldChange('description', content);
            }}
            placeholder="Fridge Broken - Microwave not working - Oven not heating"
          />
        </Box>
      </FormControl>
      <FormControl>
        <InputLabel shrink htmlFor="description-editor">
          Cost Code <span style={{ fontWeight: 'lighter' }}>(required)</span>
        </InputLabel>
        <Box sx={{ mt: '8px', '& .tiptap-container': { minHeight: '8rem' } }}>
          <TextEditor
            content={report.description || ''}
            onUpdate={(content) => {
              handleFieldChange('description', content);
            }}
            placeholder="C100 - C203 - C880"
          />
        </Box>
      </FormControl>
      <Uploader report={report} setReport={setReport} />
    </>
  );
}
