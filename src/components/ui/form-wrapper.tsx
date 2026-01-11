import { Button } from "./button";

interface FormWrapperProps {
  title?: string;
  onCancel?: () => void;
  children: React.ReactNode;
}

export function FormWrapper({ title, onCancel, children }: FormWrapperProps) {
  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-md">
      {title && onCancel && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button variant="outline" onClick={onCancel}>
            Cancel Edit
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
