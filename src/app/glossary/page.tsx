import { getGlossaryTerms } from "@/lib/content";
import GlossaryBrowser from "@/components/GlossaryBrowser";

export const metadata = { title: "Glossary" };

export default function GlossaryPage() {
  const terms = getGlossaryTerms();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Glossary</h1>
        <p className="max-w-2xl text-zinc-400">
          The vocabulary of data science, A–Z, in plain English. Every entry
          links to the lessons, papers and roadmap days where you&apos;ll
          actually use the concept.
        </p>
      </header>
      <GlossaryBrowser terms={terms} />
    </div>
  );
}
