import { type tables } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "../ui/button";
import { FormField } from "../ui/form-field";
import { useFormState } from "@/hooks/useFormState";
import { processFormData, submitFormData, type FormField as FormFieldType } from "@/lib/form-utils";

interface CreateFormProps<T> {
  fields: FormFieldType<T>[];
  tableName: keyof typeof tables;
  defaultValues?: Partial<T>;
  beforeSubmit?: (data: Partial<T>) => Promise<Partial<T>>;
}

export default function CreateForm<T>(props: CreateFormProps<T>) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialTags = (() => {
    const tags: Record<string, string[]> = {};
    props.fields.forEach((field) => {
      if (field.type === "tags" && props.defaultValues) {
        const defaultValue = (props.defaultValues as any)[field.name];
        if (Array.isArray(defaultValue)) {
          tags[String(field.name)] = defaultValue;
        }
      }
    });
    return tags;
  })();

  const {
    selectValues,
    richtextValues,
    tagsValues,
    handleSelectChange,
    handleRichtextChange,
    handleTagsChange,
  } = useFormState(initialTags);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    let data = processFormData(formData, props.fields, { richtextValues, tagsValues });

    if (props.defaultValues) {
      Object.assign(data, { ...props.defaultValues, ...data });
    }

    // Call beforeSubmit hook if provided
    if (props.beforeSubmit) {
      data = await props.beforeSubmit(data);
    }

    const result = await submitFormData(props.tableName, data, "create");
    
    if (result.success) {
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setError(result.error!);
    }
    setSubmitting(false);
  };

  return (
    <form className="min-w-100 border bg-card shadow-lg p-8 my-4 rounded-lg" onSubmit={handleSubmit}>
      {props.fields.map((field) => (
        <FormField<T>
          key={String(field.name)}
          field={field}
          selectValue={selectValues[String(field.name)]}
          richtextValue={richtextValues[String(field.name)]}
          tagsValue={tagsValues[String(field.name)]}
          onSelectChange={(value) => handleSelectChange(String(field.name), value)}
          onRichtextChange={(html) => handleRichtextChange(String(field.name), html)}
          onTagsChange={(tags) => handleTagsChange(String(field.name), tags)}
        />
      ))}

      {error && (
        <p className="text-red-500 dark:text-red-400 font-medium text-sm my-2 bg-red-100 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
