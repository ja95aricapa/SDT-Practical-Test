// client/src/components/dashboard/single-appointment/forms/form-hooks.tsx
import type * as React from 'react';
import { useCallback, useState } from 'react';
import type { Report } from '@/types/report';

interface UseFormHookReturnType {
  isDescriptionValid: boolean;
  selectedOption: string;
  validateForm: () => void;
  updateTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFieldChange: (field: keyof Report, value: Report[keyof Report]) => void;
  handleSelectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleKeyAdd: <K extends keyof Report>(field: K, value: Report[K]) => void;
}

interface UseFormHookParams {
  report: Report;
  setReport: React.Dispatch<React.SetStateAction<Report>>;
}

export const useFormHook = ({ report, setReport }: UseFormHookParams): UseFormHookReturnType => {
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleFieldChange = useCallback(
    (field: keyof Report, value: Report[keyof Report]) => {
      setReport((prev: Report) => ({ ...prev, [field]: value }));
    },
    [setReport]
  );

  const validateForm = useCallback(() => {
    setIsDescriptionValid(Boolean(report.description?.trim()));
  }, [report.description]);

  const updateTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFieldChange('title', event.target.value);
    },
    [handleFieldChange]
  );

  const handleSelectionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  }, []);

  const handleKeyAdd = useCallback(
    <K extends keyof Report>(field: K, value: Report[K]) => {
      handleFieldChange(field, value);
    },
    [handleFieldChange]
  );

  return {
    isDescriptionValid,
    selectedOption,
    validateForm,
    updateTitle,
    handleFieldChange,
    handleSelectionChange,
    handleKeyAdd,
  };
};
