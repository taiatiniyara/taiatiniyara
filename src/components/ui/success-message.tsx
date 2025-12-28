import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SuccessMessageProps {
  icon: "check" | "email";
  title: string;
  message: string;
  children?: ReactNode;
}

export function SuccessMessage({ icon, title, message, children }: SuccessMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            icon === "check" ? "bg-green-100 dark:bg-green-900/30" : "bg-primary/10"
          }`}>
            {icon === "check" ? (
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-medium text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{message}</p>
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Card>
    </div>
  );
}
