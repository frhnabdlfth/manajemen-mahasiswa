import { Eye, EyeOff, Lock } from "lucide-react";

export default function AuthPasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide">
        {label}
      </span>

      <div className="flex h-13 min-h-13 items-center gap-3 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[5px_5px_0_#000] focus-within:bg-white">
        <Lock size={20} className="shrink-0" />

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-black outline-none placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-[12px] border-[3px] border-black bg-white shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
          aria-label="Toggle password"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
