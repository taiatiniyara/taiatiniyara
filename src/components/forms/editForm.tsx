import { supabase, type tables } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FormField } from "../ui/form-field";
import LoadingSpinner from "../ui/loading-spinner";

interface EditFormProps<T> {
  fields: {
    name: keyof T;
    type:
      | "text"
      | "number"
      | "email"
      | "password"
      | "textarea"
      | "select"
      | "richtext"
      | "tags"
      | "checkbox";
    options?: {
      label?: string;
      value: string;
    }[]; // for select type
    editable?: boolean; // if false, field will be readonly
  }[];
  tableName: keyof typeof tables;
  recordId: string; // ID of the record to edit
  matchColumn?: string; // Column to match for fetching (default: 'id')
  onSuccess?: () => void; // Callback after successful update
}

export default function EditForm<T>(props: EditFormProps<T>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const [richtextValues, setRichtextValues] = useState<Record<string, string>>(
    {}
  );
  const [tagsValues, setTagsValues] = useState<Record<string, string[]>>({});

  // Fetch existing data
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

        // Initialize state for special field types
        const initialSelect: Record<string, string> = {};
        const initialRichtext: Record<string, string> = {};
        const initialTags: Record<string, string[]> = {};

        props.fields.forEach((field) => {
          const value = (data as any)[field.name];

          if (field.type === "select" && value) {
            initialSelect[String(field.name)] = value;
          } else if (field.type === "richtext" && value) {
            initialRichtext[String(field.name)] = value;
          } else if (field.type === "tags" && Array.isArray(value)) {
            initialTags[String(field.name)] = value;
          }
        });

        setSelectValues(initialSelect);
        setRichtextValues(initialRichtext);
        setTagsValues(initialTags);
      }

      setLoading(false);
    };

    fetchData();
  }, [props.recordId, props.tableName, props.matchColumn]);

  if (loading) {
    return (
      <div className="min-w-100 border bg-card shadow-lg p-8 my-4 flex items-center justify-center min-h-75 rounded-lg">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form
      className="min-w-100 border bg-card shadow-lg p-8 my-4 rounded-lg"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formDataObj = new FormData(e.currentTarget);

        const data: Partial<T> = {};
        props.fields.forEach((field) => {
          let value = formDataObj.get(String(field.name));

          // For richtext fields, use the stored HTML value
          if (field.type === "richtext") {
            value = richtextValues[String(field.name)] || "";
          }

          // For tags fields, use the stored array value
          if (field.type === "tags") {
            (data as any)[field.name] = tagsValues[String(field.name)] || [];
            return;
          }

          // For checkbox fields, convert to boolean
          if (field.type === "checkbox") {
            (data as any)[field.name] = value === "on";
            return;
          }

          if (value !== null && value !== undefined) {
            if (field.type === "number") {
              (data as any)[field.name] = Number(value);
            } else {
              (data as any)[field.name] = value;
            }
          }
        });

        // Add updated_at timestamp
        (data as any).updated_at = new Date();

        console.log("Data to be updated:", data);

        const matchColumn = props.matchColumn || "id";
        const c = await supabase
          .from(props.tableName)
          .update(data)
          .eq(matchColumn, props.recordId);

        console.log("Supabase response:", c);
        if (c.error) {
          setError(c.error.message);
          toast.error("Error updating: " + c.error.message);
        } else {
          setError(null);
          toast.success("Updated successfully!");
          if (props.onSuccess) {
            props.onSuccess();
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }
        setSubmitting(false);
      }}
    >
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
            onSelectChange={(value) => {
              setSelectValues((prev) => ({
                ...prev,
                [String(field.name)]: value,
              }));
            }}
            onRichtextChange={(html) => {
              setRichtextValues((prev) => ({
                ...prev,
                [String(field.name)]: html,
              }));
            }}
            onTagsChange={(tags) => {
              setTagsValues((prev) => ({
                ...prev,
                [String(field.name)]: tags,
              }));
            }}
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
