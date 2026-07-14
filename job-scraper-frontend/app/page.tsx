import { getJobs } from "@/lib/api/jobs";


export default async function Home() {
    const jobs = await getJobs();

  return (
    <main className="min-h-screen">
      {/* Masthead */}
      <header className="border-b border-line px-6 md:px-12 py-10 md:py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.3fr_1fr] gap-10 items-end">
          <div>
            <p className="font-mono text-xs tracking-wide text-muted uppercase mb-4">
              Live · updated every 30 minutes
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] text-ink">
              Jobs, as they're
              <br />
              actually posted.
            </h1>
            <p className="text-muted mt-4 max-w-md">
              Tracking company career pages, ATS boards, and job sites across Nepal and beyond — deduplicated, timestamped, no ghost listings.
            </p>
          </div>

          <div className="flex md:flex-col gap-6 md:gap-3 font-mono text-sm border-t md:border-t-0 md:border-l border-line pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-2xl text-ink block">247</span>
              <span className="text-muted">jobs tracked today</span>
            </div>
            <div>
              <span className="text-2xl text-ink block">18</span>
              <span className="text-muted">sources monitored</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search command bar */}
      <section className="px-6 md:px-12 py-6 border-b border-line bg-white/40">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="font-mono text-muted text-sm hidden md:inline">/search</span>
          <input
            type="text"
            placeholder="title, company, or location..."
            className="flex-1 bg-transparent border-b border-line focus:border-ink outline-none py-2 text-ink placeholder:text-muted transition-colors"
          />
          <button className="font-mono text-xs uppercase tracking-wide border border-ink px-4 py-2 hover:bg-ink hover:text-base transition-colors">
            Search
          </button>
        </div>
      </section>

      {/* Job list */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-8">
        <div className="divide-y divide-line">
          {jobs.map((job, i) => (
            <a
              key={i}
              href="#"
              className="group flex flex-col md:flex-row md:items-center justify-between gap-2 py-5 hover:bg-white/60 -mx-4 px-4 transition-colors"
            >
              <div>
                <h2 className="text-ink font-medium group-hover:underline underline-offset-4">
                  {job.title}
                </h2>
                <p className="text-muted text-sm mt-0.5">
                  {job.company} · {job.location}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted shrink-0">
                {job.fresh && (
                  <span className="w-1.5 h-1.5 rounded-full bg-signal inline-block" />
                )}
                <span>{job.seenAgo}</span>
                <span className="text-line">·</span>
                <span>via {job.source}</span>
                {job.boards > 1 && (
                  <>
                    <span className="text-line">·</span>
                    <span className="text-rust">seen on {job.boards} boards</span>
                  </>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}