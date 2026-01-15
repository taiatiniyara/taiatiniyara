import { supabase, type tables } from "@/lib/supabase";
import { toast } from "sonner";

export type FormFieldType = "text" | "number" | "email" | "password" | "textarea" | "select" | "richtext" | "tags" | "checkbox";

export interface FormField<T> {
  name: keyof T;
  type: FormFieldType;
  options?: { label?: string; value: string }[];
  editable?: boolean;
}

interface FormState {
  richtextValues: Record<string, string>;
  tagsValues: Record<string, string[]>;
}

interface SubmitResult {
  success: boolean;
  error: string | null;
}

/**
 * Shared form data processing logic
 * Reduces duplication between CreateForm and EditForm
 * @template T - The type of data being processed
 * @param formData - FormData from form submission
 * @param fields - Array of form field definitions
 * @param formState - Current state of richtext and tags fields
 * @returns Processed data object
 */
export function processFormData<T>(
  formData: FormData,
  fields: FormField<T>[],
  formState: FormState
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
 * Generic form submission handler for create and update operations
 * @template T - The type of data being submitted
 * @param tableName - Name of the Supabase table
 * @param data - Data to submit
 * @param mode - Operation mode: "create" or "update"
 * @param recordId - ID of record to update (required for update mode)
 * @param matchColumn - Column name to match for updates (default: "id")
 * @returns Result object with success status and optional error message
 */
export async function submitFormData<T>(
  tableName: keyof typeof tables,
  data: Partial<T>,
  mode: "create" | "update",
  recordId?: string,
  matchColumn: string = "id"
): Promise<SubmitResult> {
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
 * Prepares select, richtext, and tags fields with their current values
 * @template T - The type of data
 * @param data - Existing data object
 * @param fields - Array of form field definitions
 * @returns Initialized state objects for each field type
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
