interface InputFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  action?: React.ReactNode
  required?: boolean
  placeholder?: string
}

export function InputField({
  label,
  value,
  onChange,
  action,
  required,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {action && <div className="mb-px shrink-0">{action}</div>}
      </div>
    </div>
  )
}
