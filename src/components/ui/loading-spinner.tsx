import PuffLoader from "react-spinners/PuffLoader";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8 text-gray-500">
      <PuffLoader color="#db2777" size={size || 70} />
      {text}
    </div>
  );
}
