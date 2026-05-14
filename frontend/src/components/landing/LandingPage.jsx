import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Braces,
  Clock3,
  Database,
  Download,
  FileJson,
  GraduationCap,
  KeyRound,
  Layers3,
  LockKeyhole,
  MailCheck,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Table2,
  Upload,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Table2 size={24} />,
    title: "CRUD Mahasiswa",
    desc: "Kelola data mahasiswa dari tambah, edit, hapus, sampai tampil data. Input juga divalidasi pakai Regex biar nggak asal masuk.",
    color: "bg-[#4ADE80]",
  },
  {
    icon: <Search size={24} />,
    title: "Pencarian Data",
    desc: "Cari data pakai Linear Search, Sequential Search, atau Binary Search sesuai kebutuhan.",
    color: "bg-[#93C5FD]",
  },
  {
    icon: <Shuffle size={24} />,
    title: "Sorting Multi Algoritma",
    desc: "Urutkan data berdasarkan nama, NIM, email, jurusan, angkatan, atau tipe mahasiswa.",
    color: "bg-[#C4B5FD]",
  },
  {
    icon: <FileJson size={24} />,
    title: "Export & Import JSON",
    desc: "Data bisa diekspor ke file JSON dan dibaca ulang dari file yang tersimpan di backend.",
    color: "bg-[#FDBA74]",
  },
  {
    icon: <LockKeyhole size={24} />,
    title: "Pydantic Validation",
    desc: "Login admin memakai token, jadi akses dashboard lebih aman dan terkontrol.",
    color: "bg-[#F9A8D4]",
  },
  {
    icon: <MailCheck size={24} />,
    title: "Verifikasi Email",
    desc: "Akun admin wajib verifikasi kode email terlebih dahulu sebelum bisa masuk aplikasi.",
    color: "bg-[#FFDE59]",
  },
];

const searchAlgorithms = [
  {
    name: "Linear Search",
    best: "O(1)",
    worst: "O(n)",
    desc: "Mengecek data satu per satu sampai menemukan data yang cocok.",
  },
  {
    name: "Binary Search",
    best: "O(1)",
    worst: "O(log n)",
    desc: "Membagi data menjadi dua setiap iterasi. Cocok untuk data yang sudah terurut.",
  },
  {
    name: "Sequential Search",
    best: "O(1)",
    worst: "O(n)",
    desc: "Mencari data secara berurutan dari awal sampai menemukan hasil yang sesuai.",
  },
];

const sortAlgorithms = [
  {
    name: "Insertion Sort",
    best: "O(n)",
    worst: "O(n²)",
    desc: "Menyisipkan elemen satu per satu ke posisi yang tepat.",
  },
  {
    name: "Selection Sort",
    best: "O(n²)",
    worst: "O(n²)",
    desc: "Memilih elemen terkecil lalu menukarnya ke posisi yang sesuai.",
  },
  {
    name: "Bubble Sort",
    best: "O(n)",
    worst: "O(n²)",
    desc: "Membandingkan elemen bersebelahan dan menukarnya jika perlu.",
  },
  {
    name: "Merge Sort",
    best: "O(n log n)",
    worst: "O(n log n)",
    desc: "Membagi data menjadi bagian kecil lalu menggabungkannya kembali secara terurut.",
  },
  {
    name: "Shell Sort",
    best: "O(n log n)",
    worst: "O(n(log n)²)",
    desc: "Varian Insertion Sort yang memakai gap agar proses sorting lebih efisien.",
  },
];

export default function LandingPage({ onGoLogin, onGoRegister }) {
  return (
    <main className="min-h-screen bg-[#8E92B8] p-4 text-slate-950 md:p-8">
      <div className="mx-auto max-w-8xl overflow-hidden border-[4px] border-black bg-white shadow-[10px_10px_0_#000]">
        <Navbar onGoLogin={onGoLogin} onGoRegister={onGoRegister} />

        <HeroSection onGoRegister={onGoRegister} />

        <FeatureSection />

        <AlgorithmSplitSection />

        <WorkflowSection />

        <CTASection onGoRegister={onGoRegister} />
      </div>
    </main>
  );
}

function Navbar({ onGoLogin, onGoRegister }) {
  return (
    <header className="flex items-center justify-between border-b-[4px] border-black bg-white px-5 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 lg:h-11 lg:w-11 place-items-center rounded-[14px] border-[3px] border-black bg-[#4ADE80] shadow-[3px_3px_0_#000]">
          <GraduationCap size={24} />
        </div>

        <div>
          <b className="hidden lg:block text-xl font-black leading-none">
            Manajemen Mahasiswa
          </b>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        <button
          type="button"
          onClick={onGoLogin}
          className="cursor-pointer rounded-[12px] border-[3px] border-black bg-white px-4 py-2 text-xs font-black shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] md:text-sm"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={onGoRegister}
          className="cursor-pointer rounded-[12px] border-[3px] border-black bg-[#FFDE59] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] md:text-sm"
        >
          Daftar
        </button>
      </nav>
    </header>
  );
}

function HeroSection({ onGoRegister }) {
  return (
    <section className="relative grid min-h-[620px] overflow-hidden border-b-[4px] border-black bg-[#D8C8FF] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(#000_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 flex flex-col justify-center px-6 py-12 md:px-14">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl"
        >
          Kelola data{" "}
          <span className="inline-block rotate-[-2deg] border-[4px] border-black bg-[#FF8DA1] px-3 shadow-[5px_5px_0_#000]">
            mahasiswa
          </span>{" "}
          dengan konsep algoritma.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.1 }}
          className="mt-6 max-w-2xl text-sm font-bold leading-7 md:text-base"
        >
          Aplikasi ini bukan cuma CRUD biasa. Tetapi, di dalamnya ada validasi
          Regex, verifikasi email, File I/O JSON, search algorithm, sorting
          algorithm, dan estimasi time complexity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onGoRegister}
            className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[16px] border-[4px] border-black bg-[#FFDE59] px-6 text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
          >
            Mulai Kelola Data
            <ArrowRight size={18} />
          </button>

          <a
            href="#algoritma"
            className="flex h-14 items-center justify-center rounded-[16px] border-[4px] border-black bg-white px-6 text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
          >
            Lihat Algoritma
          </a>
        </motion.div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 pb-12 lg:py-12">
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative h-[430px] w-full max-w-[520px]">
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="absolute right-0 top-0 w-[82%] rounded-[22px] border-[4px] border-black bg-white p-4 shadow-[8px_8px_0_#000]"
      >
        <div className="mb-4 flex items-center justify-between border-b-[3px] border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-black bg-[#FB7185]" />
            <div className="h-3 w-3 rounded-full border-2 border-black bg-[#FFDE59]" />
            <div className="h-3 w-3 rounded-full border-2 border-black bg-[#4ADE80]" />
          </div>
          <span className="text-xs font-black">Dashboard</span>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[16px] border-[3px] border-black bg-[#4ADE80] p-4 shadow-[4px_4px_0_#000]">
            <p className="text-xs font-black">Total Mahasiswa</p>
            <p className="mt-1 text-4xl font-black">120</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat color="bg-[#93C5FD]" label="Reguler" value="82" />
            <MiniStat color="bg-[#F9A8D4]" label="Beasiswa" value="38" />
          </div>

          <div className="rounded-[16px] border-[3px] border-black bg-[#FFF7D6] p-3">
            <div className="mb-2 h-3 w-2/3 rounded-full bg-black" />
            <div className="mb-2 h-3 w-1/2 rounded-full bg-black/60" />
            <div className="h-3 w-5/6 rounded-full bg-black/30" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30, rotate: -4 }}
        animate={{ opacity: 1, x: 0, rotate: -4 }}
        transition={{ duration: 0.25, delay: 0.18 }}
        className="absolute bottom-6 left-0 w-[76%] rounded-[22px] border-[4px] border-black bg-[#2E174A] p-4 text-white shadow-[8px_8px_0_#000]"
      >
        <div className="mb-4 rounded-[14px] border-[3px] border-black bg-[#C4B5FD] px-4 py-3 text-black">
          <b className="text-sm">Search & Sorting</b>
          <p className="text-xs font-bold">Linear · Binary · Merge · Shell</p>
        </div>

        {[
          ["20240021001", "Budi Santoso"],
          ["20230021002", "Nadia Putri"],
          ["20210021005", "Gilang Mahendra"],
        ].map((item) => (
          <div
            key={item[0]}
            className="mb-2 flex items-center justify-between rounded-[12px] border-[2px] border-white bg-white/10 px-3 py-2"
          >
            <span className="text-xs font-black">{item[1]}</span>
            <span className="text-[10px] font-bold">{item[0]}</span>
          </div>
        ))}
      </motion.div>

      <FloatingIcon className="left-8 top-10" color="bg-[#FFDE59]">
        <Binary size={24} />
      </FloatingIcon>

      <FloatingIcon className="right-8 bottom-0" color="bg-[#FB7185]">
        <KeyRound size={24} />
      </FloatingIcon>

      <FloatingIcon className="left-20 bottom-40" color="bg-[#4ADE80]">
        <Braces size={24} />
      </FloatingIcon>
    </div>
  );
}

function MiniStat({ color, label, value }) {
  return (
    <div
      className={`rounded-[14px] border-[3px] border-black ${color} p-3 shadow-[3px_3px_0_#000]`}
    >
      <p className="text-xs font-black">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function FloatingIcon({ className, color, children }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute grid h-14 w-14 place-items-center rounded-[16px] border-[4px] border-black ${color} shadow-[4px_4px_0_#000] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FeatureSection() {
  return (
    <section className="border-b-[4px] border-black bg-white px-6 py-16 md:px-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          Semua fitur utama ada dalam satu aplikasi.
        </h2>
        <p className="mt-4 text-sm font-bold leading-6 text-slate-700">
          Dibuat dengan flow yang simpel: data mahasiswa bisa dikelola, dicari,
          diurutkan, diekspor, dan diamankan dengan login admin.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="rounded-[24px] border-[4px] border-black bg-white p-5 shadow-[7px_7px_0_#000]"
          >
            <div
              className={`mb-4 grid h-14 w-14 place-items-center rounded-[16px] border-[3px] border-black ${item.color} shadow-[3px_3px_0_#000]`}
            >
              {item.icon}
            </div>

            <h3 className="text-xl font-black">{item.title}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
              {item.desc}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function AlgorithmSplitSection() {
  return (
    <section
      id="algoritma"
      className="grid border-b-[4px] border-black lg:grid-cols-2"
    >
      <AlgorithmPanel
        title="Algoritma Pencarian"
        badge="Search"
        color="bg-[#93C5FD]"
        icon={<Search size={28} />}
        items={searchAlgorithms}
      />

      <AlgorithmPanel
        title="Algoritma Pengurutan"
        badge="Sort"
        color="bg-[#F9A8D4]"
        icon={<Shuffle size={28} />}
        items={sortAlgorithms}
      />
    </section>
  );
}

function AlgorithmPanel({ title, badge, color, icon, items }) {
  return (
    <div className={`border-black p-6 md:p-10 lg:border-r-[4px] ${color}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex rounded-full border-[3px] border-black bg-white px-4 py-2 text-xs font-black shadow-[3px_3px_0_#000]">
            {badge}
          </span>
          <h2 className="text-2xl font-black md:text-4xl">{title}</h2>
        </div>

        <div className="grid h-16 w-16 place-items-center rounded-[18px] border-[4px] border-black bg-white shadow-[5px_5px_0_#000]">
          {icon}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.name}
            className="rounded-[22px] border-[4px] border-black bg-white p-4 shadow-[5px_5px_0_#000]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg font-black">{item.name}</h3>
              <span className="rounded-full border-[3px] border-black bg-[#FFDE59] px-3 py-1 text-xs font-black">
                Best {item.best} · Worst {item.worst}
              </span>
            </div>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function WorkflowSection() {
  return (
    <section className="grid border-b-[4px] border-black bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="border-b-[4px] border-black bg-[#FFDE59] p-6 md:p-10 lg:border-b-0 lg:border-r-[4px]">
        <h2 className="text-4xl font-black leading-tight">
          Flow aplikasi dibuat sederhana.
        </h2>
        <p className="mt-4 text-sm font-bold leading-6">
          User daftar akun, verifikasi email, login, lalu bisa masuk ke
          dashboard untuk mengelola data mahasiswa.
        </p>

        <div className="mt-8 rounded-[24px] border-[4px] border-black bg-white p-5 shadow-[7px_7px_0_#000]">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} />
            <div>
              <b className="block font-black">Autentikasi Aman</b>
              <span className="text-sm font-bold text-slate-700">
                Pydantic validation + verifikasi email.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 bg-[#FFF7D6] p-6 md:grid-cols-2 md:p-10">
        <WorkflowCard
          number="01"
          icon={<UserPlus size={24} />}
          title="Daftar Admin"
          desc="Admin membuat akun dengan username, email, nama, dan password."
        />

        <WorkflowCard
          number="02"
          icon={<MailCheck size={24} />}
          title="Verifikasi Email"
          desc="Kode dikirim ke email dan harus diverifikasi sebelum bisa login."
        />

        <WorkflowCard
          number="03"
          icon={<Database size={24} />}
          title="Kelola Data"
          desc="Tambah, edit, hapus, search, sort, export, dan read data JSON."
        />

        <WorkflowCard
          number="04"
          icon={<Clock3 size={24} />}
          title="Lihat Complexity"
          desc="Setiap algoritma punya estimasi kompleksitas agar mudah dijelaskan."
        />
      </div>
    </section>
  );
}

function WorkflowCard({ number, icon, title, desc }) {
  return (
    <article className="rounded-[24px] border-[4px] border-black bg-white p-5 shadow-[6px_6px_0_#000]">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-xl border-[3px] border-black bg-[#C4B5FD] px-4 py-1 pt-2 text-xs font-black">
          {number}
        </span>
        <div className="grid h-12 w-12 place-items-center rounded-[15px] border-[3px] border-black bg-[#4ADE80] shadow-[3px_3px_0_#000]">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
        {desc}
      </p>
    </article>
  );
}

function CTASection({ onGoRegister }) {
  return (
    <section className="bg-white px-6 py-16 text-center md:px-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          Siap kelola data mahasiswa dengan lebih rapi?
        </h2>
        <p className="mt-4 text-sm font-bold leading-6 text-slate-700">
          Mulai dari buat akun admin, verifikasi email, lalu masuk ke dashboard
          untuk mengelola data mahasiswa.
        </p>

        <button
          type="button"
          onClick={onGoRegister}
          className="mt-8 inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[18px] border-[4px] border-black bg-[#FB7185] px-7 text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
        >
          Daftar Sekarang
          <ArrowRight size={18} />
        </button>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <MiniBadge icon={<Download size={16} />} text="Export JSON" />
          <MiniBadge icon={<Upload size={16} />} text="Read JSON" />
          <MiniBadge icon={<BadgeCheck size={16} />} text="Regex Validated" />
          <MiniBadge icon={<Layers3 size={16} />} text="5 Sorting Methods" />
        </div>
      </div>
    </section>
  );
}

function MiniBadge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-[#FFF7D6] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#000]">
      {icon}
      {text}
    </span>
  );
}
