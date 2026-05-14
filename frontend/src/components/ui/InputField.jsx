export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide">
        {label}
      </span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-12 w-full rounded-[16px] border-[4px] border-black bg-[#FFF7D6] px-4 text-sm font-semibold outline-none shadow-[4px_4px_0_#000] placeholder:text-slate-500"
      />
    </label>
  );
}
