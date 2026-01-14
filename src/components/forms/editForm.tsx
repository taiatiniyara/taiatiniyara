import { supabase, type tables } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FormField } from "../ui/form-field";
import LoadingSpinner from "../ui/loading-spinner";
import { useFormState } from "@/hooks/useFormState";
import { processFormData, submitFormData, initializeFormState, type FormField as FormFieldType } from "@/lib/form-utils";

interface EditFormProps<T> {
  fields: FormFieldType<T>[];
  tableName: keyof typeof tables;
  recordId: string;
  matchColumn?: string;
  onSuccess?: () => void;
}

export default function EditForm<T>(props: EditFormProps<T>) {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});

  const {
    selectValues,
    richtextValues,
    tagsValues,
    handleSelectChange,
    handleRichtextChange,
    handleTagsChange,
    setSelectValues,
    setRichtextValues,
    setTagsValues,
  } = useFormState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const matchColumn = props.matchColumn || "id";

      const { data, error } = await supabase
        .from(props.tableName)
        .select("*")
        .eq(matchColumn, props.recordId)
        .single();

      if (error) {
        setError(`Failed to load data: ${error.message}`);
        toast.error(`Failed to load data: ${error.message}`);
      } else if (data) {
        setFormData(data as Partial<T>);
        const { initialSelect, initialRichtext, initialTags } = initializeFormState(data, props.fields);
        setSelectValues(initialSelect);
        setRichtextValues(initialRichtext);
        setTagsValues(initialTags);
      }

      setLoading(false);
    };

    fetchData();
  }, [props.recordId, props.tableName, props.matchColumn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formDataObj = new FormData(e.currentTarget);
    const data = processFormData(formDataObj, props.fields, { richtextValues, tagsValues });

    const result = await submitFormData(props.tableName, data, "update", props.recordId, props.matchColumn);

    if (result.success) {
      if (props.onSuccess) {
        props.onSuccess();
      } else {
        setTimeout(() => window.location.reload(), 2000);
      }
    } else {
      setError(result.error!);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-w-100 border bg-card shadow-lg p-8 my-4 flex items-center justify-center min-h-75 rounded-lg">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form className="min-w-100 border bg-card shadow-lg p-8 my-4 rounded-lg" onSubmit={handleSubmit}>
      {props.fields.map((field) => {
        const fieldValue = (formData as any)[field.name];
        const isEditable = field.editable !== false;

        return (
          <FormField<T>
            key={String(field.name)}
            field={field}
            value={fieldValue}
            selectValue={selectValues[String(field.name)]}
            richtextValue={richtextValues[String(field.name)]}
            tagsValue={tagsValues[String(field.name)]}
            isEditable={isEditable}
            onSelectChange={(value) => handleSelectChange(String(field.name), value)}
            onRichtextChange={(html) => handleRichtextChange(String(field.name), html)}
            onTagsChange={(tags) => handleTagsChange(String(field.name), tags)}
          />
        );
      })}

      {error && (
        <p className="text-red-500 dark:text-red-400 font-medium text-sm my-2 bg-red-100 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}
