import BarLoader from "react-spinners/BarLoader";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size, text }: LoadingSpinnerProps) {
  return (
    <div className="flex w-full flex-col gap-4 items-center justify-center p-8 text-gray-500 italic">
      <BarLoader color="#ec4899" width={size || 200} />
      {text}
    </div>
  );
}
