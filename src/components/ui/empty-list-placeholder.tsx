interface EmptyListPlaceholderProps {
  text: string;
}

export default function EmptyListPlaceholder({
  text,
}: EmptyListPlaceholderProps) {
  return (
    <div className="p-8 bg-gray-100 text-gray-600 border-dashed border w-full border-gray-300 text-center">
      {text}
    </div>
  );
}
