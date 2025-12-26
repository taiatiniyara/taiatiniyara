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
import { useState } from "react";
import { Button } from "../ui/button";

interface CreateFormProps<T> {
  fields: {
    name: keyof T;
    type: "text" | "number" | "email" | "password" | "textarea" | "select";
    options?: string[]; // for select type
  }[];
  tableName: keyof typeof tables;
  defaultValues?: Partial<T>;
}

export default function CreateForm<T>(props: CreateFormProps<T>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});

  return (
    <form
      className="min-w-100 border bg-white shadow-lg p-8 my-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        console.log("Form Data Submitted:", formData.entries());
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

        if (props.defaultValues) {
          Object.assign(data, props.defaultValues);
        }

        const c = await supabase.from(props.tableName).insert(data);
        if (c.error) {
          setError(c.error.message);
        } else {
          setError(null);
          e.currentTarget.reset();
        }
        setSubmitting(false);
        window.location.reload();
      }}
    >
      {props.fields.map((field) => (
        <div key={String(field.name)} className="mb-4">
          <Label className="mb-2">
            {(
              String(field.name).at(0)!.toUpperCase() +
              String(field.name).slice(1)
            )
              .split("_")
              .join(" ")}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              name={String(field.name)}
              placeholder={`Enter ${String(field.name).toLowerCase()} here...`}
              required
            />
          ) : field.type === "select" ? (
            <>
              <Select
                name={String(field.name)}
                required
                onValueChange={(value) => {
                  setSelectValues((prev) => ({
                    ...prev,
                    [String(field.name)]: value,
                  }));
                }}
              >
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
              <input
                type="hidden"
                name={String(field.name)}
                value={selectValues[String(field.name)] || ""}
              />
            </>
          ) : (
            <Input
              name={String(field.name)}
              placeholder={`Enter ${String(field.name).toLowerCase()} here...`}
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

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
