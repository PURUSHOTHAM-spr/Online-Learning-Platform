function HeroSlider() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#dfe1e8] bg-linear-to-br from-[#fff5f7] via-[#f6f9ff] to-[#eef8f7] p-8 lg:p-14">
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#0f7c90]/10 blur-2xl" />
      <div className="absolute -bottom-12 left-20 h-40 w-40 rounded-full bg-[#f78da7]/20 blur-2xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 inline-block rounded-full bg-[#1c1d1f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Sale ends tonight
          </p>
          <h1 className="max-w-xl text-4xl font-black leading-tight text-[#1c1d1f] lg:text-5xl">
            Skills that move your career forward.
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#3e4143] lg:text-lg">
            Learn from expert instructors with practical projects, career paths,
            and learner-first content curated to help you land your next role.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded bg-[#1c1d1f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b0c0d]">
              Explore courses
            </button>
            <button className="rounded border border-[#1c1d1f] px-5 py-3 text-sm font-bold text-[#1c1d1f] transition hover:bg-white">
              View learning paths
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#4d5156]">
            <span>50K+ learners</span>
            <span>1,200+ classes</span>
            <span>4.8 average rating</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#d9dbe3] bg-white p-4 shadow-[0_20px_50px_-24px_rgba(17,24,39,0.45)]">
          <img
            src="https://img.freepik.com/free-photo/programmer-working-computer-office_1098-18699.jpg"
            alt="Students learning online"
            className="h-80 w-full rounded-xl object-cover lg:h-85"
          />
        </div>
      </div>

      <div className="relative mt-10 rounded-2xl border border-[#eceef3] bg-white px-4 py-5 lg:px-8">
        <p className="text-center text-sm font-medium text-[#6a6f73]">
          Trusted by teams at
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[#2d2f31] md:grid-cols-5">
          <span>Acme Corp</span>
          <span>InnoSoft</span>
          <span>BrightLabs</span>
          <span>NextWave</span>
          <span>DevNexa</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;