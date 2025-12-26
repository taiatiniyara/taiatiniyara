import { supabase, type tables } from "@/lib/supabase";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@base-ui/react";
import { useState } from "react";

interface CreateFormProps<T> {
  fields: {
    name: keyof T;
    type: "text" | "number" | "email" | "password" | "textarea" | "select";
    options?: string[]; // for select type
  }[];
  tableName: keyof typeof tables;
}

export default function CreateForm<T>(props: CreateFormProps<T>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data: Partial<T> = {};
        props.fields.forEach((field) => {
          const value = formData.get(String(field.name));
          if (value !== null) {
            if (field.type === "number") {
              (data as any)[field.name] = Number(value);
            } else {
              (data as any)[field.name] = value;
            }
          }
        });

        console.log("Form Data Submitted:", data);
        supabase
          .from(props.tableName)
          .insert(data)
          .then(({ error }) => {
            setSubmitting(false);
            if (error) {
              setError(error.message);
            } else {
              setError(null);
              e.currentTarget.reset();
            }
          });
      }}
    >
      {props.fields.map((field) => (
        <div key={String(field.name)} className="mb-4">
          <Label>
            {(
              String(field.name).at(0)!.toUpperCase() +
              String(field.name).slice(1)
            )
              .split("_")
              .join(" ")}
          </Label>
          {field.type === "textarea" ? (
            <Textarea required />
          ) : field.type === "select" ? (
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={`Select a ${String(field.name).toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectLabel>{String(field.name)}</SelectLabel>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder={`Enter ${String(field.name).toLowerCase()}`}
              type={field.type}
              required
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-red-500 font-medium text-sm my-2 bg-red-100 p-4">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
