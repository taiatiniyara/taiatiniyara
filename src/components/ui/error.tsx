interface ErrorBoxProps {
  message: string;
}
export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="m-4 bg-red-100 text-red-600 border-dashed border border-red-300 text-center p-8">
      {message}
    </div>
  );
}
