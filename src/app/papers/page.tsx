import { getPapers } from "@/lib/content";
import PapersBrowser from "@/components/PapersBrowser";

export const metadata = { title: "Research Library" };

export default function PapersPage() {
  const papers = getPapers();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Research Library</h1>
        <p className="max-w-2xl text-zinc-400">
          The papers that shaped modern data science and AI — curated, tagged and
          summarized in plain language. Each entry links to the original paper and to
          the roadmap days where it becomes relevant.
        </p>
      </header>
      <PapersBrowser papers={papers} />
    </div>
  );
}
