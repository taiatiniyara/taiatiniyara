import { useState } from "react";

/**
 * Custom hook to manage common form state (select, richtext, tags, checkboxes)
 * Reduces boilerplate code in form components
 */
export function useFormState(initialTags?: Record<string, string[]>) {
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const [richtextValues, setRichtextValues] = useState<Record<string, string>>({});
  const [tagsValues, setTagsValues] = useState<Record<string, string[]>>(initialTags || {});

  const handleSelectChange = (fieldName: string, value: string) => {
    setSelectValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleRichtextChange = (fieldName: string, html: string) => {
    setRichtextValues(prev => ({ ...prev, [fieldName]: html }));
  };

  const handleTagsChange = (fieldName: string, tags: string[]) => {
    setTagsValues(prev => ({ ...prev, [fieldName]: tags }));
  };

  const getFieldValue = (fieldName: string, type: string, formValue: any): any => {
    if (type === "richtext") return richtextValues[fieldName] || "";
    if (type === "tags") return tagsValues[fieldName] || [];
    if (type === "checkbox") return formValue === "on";
    if (type === "number") return Number(formValue);
    return formValue;
  };

  return {
    selectValues,
    richtextValues,
    tagsValues,
    handleSelectChange,
    handleRichtextChange,
    handleTagsChange,
    getFieldValue,
    setSelectValues,
    setRichtextValues,
    setTagsValues,
  };
}
