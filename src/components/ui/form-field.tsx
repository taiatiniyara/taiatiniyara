import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import Tiptap from "@/components/tiptap-lazy";

interface FormFieldProps<T> {
  field: {
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
    options?: string[];
    editable?: boolean;
  };
  value?: any;
  selectValue?: string;
  richtextValue?: string;
  tagsValue?: string[];
  onSelectChange?: (value: string) => void;
  onRichtextChange?: (html: string) => void;
  onTagsChange?: (tags: string[]) => void;
  isEditable?: boolean;
}

export function FormField<T>({
  field,
  value,
  selectValue,
  richtextValue,
  tagsValue,
  onSelectChange,
  onRichtextChange,
  onTagsChange,
  isEditable = true,
}: FormFieldProps<T>) {
  const fieldName = String(field.name);
  const fieldLabel = (fieldName.charAt(0).toUpperCase() + fieldName.slice(1))
    .split("_")
    .join(" ");

  return (
    <div className="mb-4">
      <Label className="mb-2">{fieldLabel}</Label>
      {field.type === "richtext" ? (
        <>
          <Tiptap
            content={richtextValue || "<p>Start writing...</p>"}
            onChange={(html) => onRichtextChange?.(html)}
          />
          <input
            type="hidden"
            name={fieldName}
            value={richtextValue || ""}
          />
        </>
      ) : field.type === "tags" ? (
        <TagsInput
          value={tagsValue || []}
          onChange={(tags) => onTagsChange?.(tags)}
          placeholder={`Add ${fieldName.toLowerCase()}...`}
        />
      ) : field.type === "textarea" ? (
        <Textarea
          name={fieldName}
          placeholder={`Enter ${fieldName.toLowerCase()} here...`}
          defaultValue={value || ""}
          readOnly={!isEditable}
          required
        />
      ) : field.type === "select" ? (
        <>
          <Select
            name={fieldName}
            required
            disabled={!isEditable}
            value={selectValue || ""}
            onValueChange={onSelectChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select a ${fieldName.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>{fieldLabel}</SelectLabel>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            name={fieldName}
            value={selectValue || ""}
          />
        </>
      ) : (
        <Input
          name={fieldName}
          placeholder={`Enter ${fieldName.toLowerCase()} here...`}
          type={field.type}
          defaultValue={value || ""}
          readOnly={!isEditable}
          required
        />
      )}
    </div>
  );
}
