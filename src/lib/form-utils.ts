import { supabase, type tables } from "@/lib/supabase";
import { toast } from "sonner";

export interface FormField<T> {
  name: keyof T;
  type: "text" | "number" | "email" | "password" | "textarea" | "select" | "richtext" | "tags" | "checkbox";
  options?: { label?: string; value: string }[];
  editable?: boolean;
}

/**
 * Shared form data processing logic
 * Reduces duplication between CreateForm and EditForm
 */
export function processFormData<T>(
  formData: FormData,
  fields: FormField<T>[],
  formState: {
    richtextValues: Record<string, string>;
    tagsValues: Record<string, string[]>;
  }
): Partial<T> {
  const data: Partial<T> = {};

  fields.forEach((field) => {
    const value = formData.get(String(field.name));
    const fieldName = String(field.name);

    if (field.type === "richtext") {
      (data as any)[field.name] = formState.richtextValues[fieldName] || "";
    } else if (field.type === "tags") {
      (data as any)[field.name] = formState.tagsValues[fieldName] || [];
    } else if (field.type === "checkbox") {
      (data as any)[field.name] = value === "on";
    } else if (value !== null && value !== undefined) {
      (data as any)[field.name] = field.type === "number" ? Number(value) : value;
    }
  });

  return data;
}

/**
 * Generic form submission handler
 */
export async function submitFormData<T>(
  tableName: keyof typeof tables,
  data: Partial<T>,
  mode: "create" | "update",
  recordId?: string,
  matchColumn: string = "id"
) {
  if (mode === "create") {
    const result = await supabase.from(tableName).insert(data);
    if (result.error) {
      toast.error(`Error creating: ${result.error.message}`);
      return { success: false, error: result.error.message };
    }
    toast.success("Created successfully!");
    return { success: true, error: null };
  } else {
    const result = await supabase
      .from(tableName)
      .update({ ...data, updated_at: new Date() })
      .eq(matchColumn, recordId!);
    
    if (result.error) {
      toast.error(`Error updating: ${result.error.message}`);
      return { success: false, error: result.error.message };
    }
    toast.success("Updated successfully!");
    return { success: true, error: null };
  }
}

/**
 * Initialize form state from existing data
 */
export function initializeFormState<T>(data: any, fields: FormField<T>[]) {
  const initialSelect: Record<string, string> = {};
  const initialRichtext: Record<string, string> = {};
  const initialTags: Record<string, string[]> = {};

  fields.forEach((field) => {
    const value = data[field.name];
    const fieldName = String(field.name);

    if (field.type === "select" && value) {
      initialSelect[fieldName] = value;
    } else if (field.type === "richtext" && value) {
      initialRichtext[fieldName] = value;
    } else if (field.type === "tags" && Array.isArray(value)) {
      initialTags[fieldName] = value;
    }
  });

  return { initialSelect, initialRichtext, initialTags };
}
