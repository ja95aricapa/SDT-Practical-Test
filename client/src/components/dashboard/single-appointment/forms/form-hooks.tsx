/**
 * Custom hook for managing form state.
 * Provides helper functions for updating form fields and validation.
 */
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

  // Updates the specified field in the report object
  const handleFieldChange = useCallback(
    (field: keyof Report, value: Report[keyof Report]) => {
      setReport((prev: Report) => ({ ...prev, [field]: value }));
    },
    [setReport]
  );

  // Validates the description field (assumes description is required)
  const validateForm = useCallback(() => {
    setIsDescriptionValid(Boolean(report.description?.trim()));
  }, [report.description]);

  // Updates the title field from input change
  const updateTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFieldChange('title', event.target.value);
    },
    [handleFieldChange]
  );

  // Handles selection change (if needed)
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