import HeroSlider from "../components/HeroSlider";
import CourseSection from "../components/CourseSection";

function Home() {
  return (
    <div className="bg-[#ffffff]">
      <section className="mx-auto max-w-325 px-4 pb-20 pt-6 lg:px-8">
        <HeroSlider />
        <CourseSection />

        <section className="mt-20 grid gap-6 rounded-3xl border border-[#e9eaf2] bg-[#f7f9fa] p-6 lg:grid-cols-3 lg:p-10">
          <article>
            <h3 className="text-xl font-black text-[#1c1d1f]">Hands-on projects</h3>
            <p className="mt-2 text-[#4d5156]">
              Build portfolio-ready apps guided by mentors from top companies.
            </p>
          </article>

          <article>
            <h3 className="text-xl font-black text-[#1c1d1f]">Career pathways</h3>
            <p className="mt-2 text-[#4d5156]">
              Follow structured roadmaps for frontend, backend, full stack, and data roles.
            </p>
          </article>

          <article>
            <h3 className="text-xl font-black text-[#1c1d1f]">Certificate prep</h3>
            <p className="mt-2 text-[#4d5156]">
              Practice tests and revision modules designed to help you clear interviews.
            </p>
          </article>
        </section>
      </section>
    </div>
  );
}

export default Home;