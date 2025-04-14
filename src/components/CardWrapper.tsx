// Can't really think of a better name
export default function CardWrapper({
  children,
  bgColor,
}: {
  children: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div
      className={`flex items-center rounded-full py-1 px-2 gap-1.5 ${
        bgColor ?? "bg-neutral-200"
      }`}
    >
      {children}
    </div>
  );
}
