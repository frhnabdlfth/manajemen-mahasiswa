export default function AuthInput({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide">
        {label}
      </span>

      <div className="flex h-13 min-h-13 items-center gap-3 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[5px_5px_0_#000] focus-within:bg-white">
        <span className="shrink-0">{icon}</span>

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-black outline-none placeholder:text-slate-500"
        />
      </div>
    </label>
  );
}
