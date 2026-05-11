import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MahasiswaTable({ data, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-[28px] border-[4px] border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[#C4B5FD] text-xs uppercase text-slate-950">
            <tr>
              <th className="border-b-[4px] border-black px-3 py-4 font-black text-center">
                No
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                NIM
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                Nama
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                Email
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                Jurusan
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                Angkatan
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black">
                Tipe
              </th>
              <th className="border-b-[4px] border-black px-4 py-4 font-black text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.18,
                    delay: index * 0.025,
                  }}
                  className="odd:bg-white even:bg-[#FFF7D6]"
                >
                  <td className="border-b-[3px] border-black px-4 py-4 font-semibold text-center">
                    {index + 1}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-semibold">
                    {item.nim}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-black">
                    {item.nama}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-medium">
                    {item.email}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-medium">
                    {item.jurusan}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-medium">
                    {item.angkatan}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4 font-medium">
                    {item.tipe}
                  </td>
                  <td className="border-b-[3px] border-black px-4 py-4">
                    <div className="flex gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-[14px] border-[3px] border-black bg-[#FFDE59] p-2 shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-[14px] border-[3px] border-black bg-[#FB7185] p-2 shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm font-black"
                >
                  Data mahasiswa belum tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
