import HeroV6Block from "@/components/blocks/HeroV6Block";

export default function HeroV6Demo() {
  return (
    <div className="flex flex-col gap-20 py-10">
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">Tailark Hero (Light)</h2>
        <div className="border rounded-xl overflow-hidden">
          <HeroV6Block />
        </div>
      </div>

      <div className="dark bg-zinc-950 text-zinc-50 py-10">
        <h2 className="text-2xl font-bold mb-4 px-6 text-white">Tailark Hero (Dark)</h2>
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <HeroV6Block />
        </div>
      </div>
    </div>
  );
}
