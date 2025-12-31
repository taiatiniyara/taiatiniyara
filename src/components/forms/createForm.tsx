import { supabase, type tables } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FormField } from "../ui/form-field";

interface CreateFormProps<T> {
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
      | "tags";
    options?: {
      label?: string;
      value: string;
    }[]; // for select type
  }[];
  tableName: keyof typeof tables;
  defaultValues?: Partial<T>;
}

export default function CreateForm<T>(props: CreateFormProps<T>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const [richtextValues, setRichtextValues] = useState<Record<string, string>>(
    {}
  );
  const [tagsValues, setTagsValues] = useState<Record<string, string[]>>(
    () => {
      const initialTags: Record<string, string[]> = {};
      props.fields.forEach((field) => {
        if (field.type === "tags" && props.defaultValues) {
          const defaultValue = (props.defaultValues as any)[field.name];
          if (Array.isArray(defaultValue)) {
            initialTags[String(field.name)] = defaultValue;
          }
        }
      });
      return initialTags;
    }
  );

  return (
    <form
      className="min-w-100 border bg-card shadow-lg p-8 my-4 rounded-lg"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        console.log("Form Data Submitted:", formData.entries());
        const data: Partial<T> = {};
        
        // Apply default values first
        if (props.defaultValues) {
          Object.assign(data, props.defaultValues);
        }
        
        // Then override with form values
        props.fields.forEach((field) => {
          let value = formData.get(String(field.name));

          // For richtext fields, use the stored HTML value
          if (field.type === "richtext") {
            value = richtextValues[String(field.name)] || "";
          }

          // For tags fields, use the stored array value
          if (field.type === "tags") {
            (data as any)[field.name] = tagsValues[String(field.name)] || [];
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

        console.log("Data to be inserted:", data);

        const c = await supabase.from(props.tableName).insert(data);
        console.log("Supabase response:", c);
        if (c.error) {
          setError(c.error.message);
          toast.error("Error submitting form: " + c.error.message);
        } else {
          setError(null);
          toast.success("Form submitted successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        setSubmitting(false);
      }}
    >
      {props.fields.map((field) => (
        <FormField<T>
          key={String(field.name)}
          field={field}
          selectValue={selectValues[String(field.name)]}
          richtextValue={richtextValues[String(field.name)]}
          tagsValue={tagsValues[String(field.name)]}
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
