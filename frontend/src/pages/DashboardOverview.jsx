import {
  BadgeCheck,
  Database,
  FileJson,
  ClipboardList,
  Search,
  Shuffle,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardOverview({ data = [] }) {
  const total = data.length;

  const totalReguler = data.filter((item) => item.tipe === "Reguler").length;
  const totalBeasiswa = data.filter((item) => item.tipe === "Beasiswa").length;

  const totalJurusan = new Set(data.map((item) => item.jurusan)).size;
  const totalAngkatan = new Set(data.map((item) => item.angkatan)).size;

  const regulerPercent = total ? Math.round((totalReguler / total) * 100) : 0;
  const beasiswaPercent = total ? Math.round((totalBeasiswa / total) * 100) : 0;

  const latestData = [...data].slice(0, 5);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={26} />}
          title="Total Mahasiswa"
          value={total}
          color="bg-[#4ADE80]"
          desc="Semua data aktif"
        />

        <StatCard
          icon={<UserCheck size={26} />}
          title="Mahasiswa Reguler"
          value={totalReguler}
          color="bg-[#93C5FD]"
          desc={`${regulerPercent}% dari total data`}
        />

        <StatCard
          icon={<BadgeCheck size={26} />}
          title="Mahasiswa Beasiswa"
          value={totalBeasiswa}
          color="bg-[#F9A8D4]"
          desc={`${beasiswaPercent}% dari total data`}
        />

        <StatCard
          icon={<ClipboardList size={26} />}
          title="Total Jurusan"
          value={totalJurusan}
          color="bg-[#FDBA74]"
          desc={`${totalJurusan} jurusan terdata`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black">Chart Tipe Mahasiswa</h3>
              <p className="text-sm font-semibold text-slate-600">
                Perbandingan Reguler dan Beasiswa
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-[16px] border-[3px] border-black bg-[#FFDE59] shadow-[3px_3px_0_#000]">
              <BadgeCheck size={24} />
            </div>
          </div>

          <div className="space-y-5">
            <BarChartRow
              label="Reguler"
              value={totalReguler}
              percent={regulerPercent}
              color="bg-[#60A5FA]"
            />

            <BarChartRow
              label="Beasiswa"
              value={totalBeasiswa}
              percent={beasiswaPercent}
              color="bg-[#FB7185]"
            />
          </div>
        </section>

        <section className="rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black">Fitur Aktif</h3>
              <p className="text-sm font-semibold text-slate-600">
                Algoritma digunakan dalam aplikasi
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <FeatureItem
              icon={<Search size={20} />}
              title="Search Algorithm"
              desc="Linear, Binary, Sequential"
              color="bg-[#93C5FD]"
            />

            <FeatureItem
              icon={<Shuffle size={20} />}
              title="Sorting Algorithm"
              desc="Insertion, Selection, Bubble, Merge, Shell"
              color="bg-[#C4B5FD]"
            />

            <FeatureItem
              icon={<FileJson size={20} />}
              title="File I/O JSON"
              desc="Export dan read file mahasiswa"
              color="bg-[#FDBA74]"
            />
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
        <h3 className="mb-4 text-xl font-black">Data Mahasiswa Terbaru</h3>

        <div className="grid gap-3">
          {latestData.length > 0 ? (
            latestData.map((item, index) => (
              <motion.div
                key={item.id || item.nim}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, delay: index * 0.03 }}
                className="flex flex-col justify-between gap-2 rounded-[20px] border-[3px] border-black bg-[#FFF7D6] p-4 shadow-[4px_4px_0_#000] md:flex-row md:items-center"
              >
                <div>
                  <p className="font-black">{item.nama}</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.nim} · {item.jurusan}
                  </p>
                </div>

                <span className="w-fit rounded-full border-[3px] border-black bg-white px-3 py-1 pt-1.5 text-xs font-black">
                  {item.tipe}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="rounded-[20px] border-[3px] border-black bg-[#FFF7D6] p-5 text-sm font-black shadow-[4px_4px_0_#000]">
              Belum ada data mahasiswa.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

function StatCard({ icon, title, value, color, desc }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[26px] border-[4px] border-black ${color} p-5 shadow-[7px_7px_0_#000]`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-[16px] border-[3px] border-black bg-white shadow-[3px_3px_0_#000]">
          {icon}
        </div>
      </div>

      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-4xl font-black">
        <AnimatedRandomValue value={value} />
      </p>
      <p className="mt-2 text-xs font-bold">{desc}</p>
    </motion.article>
  );
}

function AnimatedRandomValue({ value }) {
  const targetValue = Number(value) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;

    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    intervalId = window.setInterval(() => {
      const randomValue = Math.floor(Math.random() * (targetValue + 20));
      setDisplayValue(randomValue);
    }, 45);

    timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      setDisplayValue(targetValue);
    }, 900);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [targetValue]);

  return displayValue;
}

function BarChartRow({ label, value, percent, color }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span>{label}</span>
        <span>
          {value} data · {percent}%
        </span>
      </div>

      <div className="h-10 overflow-hidden rounded-[16px] border-[3px] border-black bg-[#FFF7D6] shadow-[3px_3px_0_#000]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc, color }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border-[3px] border-black bg-[#FFF7D6] p-4 shadow-[4px_4px_0_#000]">
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border-[3px] border-black ${color} shadow-[2px_2px_0_#000]`}
      >
        {icon}
      </div>

      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm font-semibold text-slate-700">{desc}</p>
      </div>
    </div>
  );
}
