interface EmptyListPlaceholderProps {
  text: string;
}

export default function EmptyListPlaceholder({
  text,
}: EmptyListPlaceholderProps) {
  return (
    <div className="m-4 bg-gray-100 text-gray-600 border-dashed border border-gray-300 text-center p-8">
      {text}
    </div>
  );
}
