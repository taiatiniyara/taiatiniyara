import { Button } from "./button";

interface AdminHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  showForm: boolean;
  onToggleForm: () => void;
}

export function AdminHeader({
  title,
  description,
  buttonText,
  showForm,
  onToggleForm,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>
      <Button
        onClick={onToggleForm}
        size="lg"
        className="w-full sm:w-auto"
      >
        {showForm ? "Cancel" : buttonText}
      </Button>
    </div>
  );
}
