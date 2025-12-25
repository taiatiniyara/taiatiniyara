import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertDialogContextType {
  showAlert: (title: string, description?: string) => void;
  showConfirm: (
    title: string,
    description?: string,
    onConfirm?: () => void
  ) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined
);

export function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider");
  }
  return context;
}

interface AlertDialogProviderProps {
  children: ReactNode;
}

export function AlertDialogProvider({ children }: AlertDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    description?: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
  }>({
    title: "",
    description: "",
    type: "alert",
  });

  const showAlert = (title: string, description?: string) => {
    setAlertConfig({
      title,
      description,
      type: "alert",
    });
    setIsOpen(true);
  };

  const showConfirm = (
    title: string,
    description?: string,
    onConfirm?: () => void
  ) => {
    setAlertConfig({
      title,
      description,
      type: "confirm",
      onConfirm,
    });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    setIsOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            {alertConfig.description && (
              <AlertDialogDescription>
                {alertConfig.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertConfig.type === "confirm" ? (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                  Continue
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction>OK</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}
