import WorkspaceClient from "@/components/workspace-client";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <section className="container mx-auto px-4 pb-12 pt-16 md:pt-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Vedic astrology platform</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Deepa&apos;s Vision
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Birth chart generation, dosha insights, and profile-based astrology workflows in one platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2">Profile-first workflow</span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2">Saved chart history</span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2">Dosha report pipeline</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
          <div className="grid gap-0 md:grid-cols-3">
            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
              <p className="text-sm font-medium text-slate-500">Step 1</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Create account</h3>
              <p className="mt-2 text-sm text-slate-600">Sign up and sign in to open your personal astrology workspace.</p>
            </div>
            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
              <p className="text-sm font-medium text-slate-500">Step 2</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Complete profile</h3>
              <p className="mt-2 text-sm text-slate-600">Add birth details once and use them for chart and dosha generation.</p>
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-slate-500">Step 3</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Generate insights</h3>
              <p className="mt-2 text-sm text-slate-600">Generate charts and check dosha reports from the same dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <WorkspaceClient />
    </div>
  );
}
