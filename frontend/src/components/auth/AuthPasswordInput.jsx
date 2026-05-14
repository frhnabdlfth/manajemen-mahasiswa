import { Eye, EyeOff, LockKeyhole } from "lucide-react";

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

      <div className="flex h-13 min-h-13 items-center gap-3 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[5px_5px_0_#000]">
        <LockKeyhole size={20} />

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={
            name === "confirm_password" ? "new-password" : "new-password"
          }
          className="w-full bg-transparent text-sm font-black outline-none placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-[10px] border-[3px] border-black bg-white shadow-[2px_2px_0_#000]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
