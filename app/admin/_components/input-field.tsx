import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Props = {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "url" | "date"
  textarea?: boolean
  defaultValue?: string
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

export function InputField({
  label,
  name,
  type = "text",
  textarea = false,
  defaultValue = "",
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
}: Props) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {textarea ? (
        <Textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
