import { BadgeCheck } from "lucide-react";

export default function AuthMessage({ type = "success", message }) {
  if (!message) return null;

  const className =
    type === "error"
      ? "mb-4 rounded-[20px] border-[4px] border-black bg-[#FB7185] px-4 py-3 text-sm font-black shadow-[5px_5px_0_#000]"
      : "mb-4 rounded-[20px] border-[4px] border-black bg-[#4ADE80] px-4 py-3 text-sm font-black shadow-[5px_5px_0_#000]";

  return (
    <div className={className}>
      {type !== "error" && <BadgeCheck size={18} className="mr-2 inline" />}
      {message}
    </div>
  );
}
