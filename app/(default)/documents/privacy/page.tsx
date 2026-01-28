import { legalDocuments } from "@/components/ui/legal-documents";

export default function PrivacyPolicyPage() {
  const document = legalDocuments.privacy;

  return (
    <section className="bg-slate-50/60 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Документ
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {document.title}
          </h1>
          <div className="mt-6">{document.content}</div>
        </div>
      </div>
    </section>
  );
}
