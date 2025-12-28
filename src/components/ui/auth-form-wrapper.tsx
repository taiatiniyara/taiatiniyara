import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthFormWrapper({ title, description, children }: AuthFormWrapperProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}
