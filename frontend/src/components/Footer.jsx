function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-gray-300 mt-16">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-white text-lg mb-8">
          Explore top skills and certifications
        </h2>

        {/* 🔥 TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

          {/* Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-3">In-demand Careers</h3>
            <ul className="space-y-2">
              <li>Data Scientist</li>
              <li>Full Stack Web Developer</li>
              <li>Cloud Engineer</li>
              <li>Project Manager</li>
              <li>Game Developer</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Web Development</h3>
            <ul className="space-y-2">
              <li>Web Development</li>
              <li>JavaScript</li>
              <li>React JS</li>
              <li>Angular</li>
              <li>Java</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-3">IT Certifications</h3>
            <ul className="space-y-2">
              <li>AWS</li>
              <li>AWS Practitioner</li>
              <li>Azure Fundamentals</li>
              <li>Solutions Architect</li>
              <li>Kubernetes</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Leadership</h3>
            <ul className="space-y-2">
              <li>Leadership</li>
              <li>Management Skills</li>
              <li>Project Management</li>
              <li>Productivity</li>
              <li>Emotional Intelligence</li>
            </ul>
          </div>

        </div>

        {/* 🔥 SECOND GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mt-10">

          <div>
            <h3 className="text-white font-semibold mb-3">
              Certifications by Skill
            </h3>
            <ul className="space-y-2">
              <li>Cybersecurity</li>
              <li>Project Management</li>
              <li>Cloud Certification</li>
              <li>Data Analytics</li>
              <li>HR Management</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Data Science</h3>
            <ul className="space-y-2">
              <li>Python</li>
              <li>Machine Learning</li>
              <li>Deep Learning</li>
              <li>ChatGPT</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Communication</h3>
            <ul className="space-y-2">
              <li>Presentation Skills</li>
              <li>Public Speaking</li>
              <li>Writing</li>
              <li>PowerPoint</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Business Analytics
            </h3>
            <ul className="space-y-2">
              <li>Excel</li>
              <li>SQL</li>
              <li>Power BI</li>
              <li>Data Analysis</li>
            </ul>
          </div>

        </div>

        {/* 🔥 BOTTOM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mt-12 border-t border-gray-700 pt-8">

          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2">
              <li>About us</li>
              <li>Careers</li>
              <li>Contact us</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Discover CourseHub
            </h3>
            <ul className="space-y-2">
              <li>Get the app</li>
              <li>Teach on CourseHub</li>
              <li>Plans & Pricing</li>
              <li>Affiliate</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              CourseHub for Business
            </h3>
            <ul className="space-y-2">
              <li>CourseHub Business</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">
              Legal & Accessibility
            </h3>
            <ul className="space-y-2">
              <li>Privacy policy</li>
              <li>Terms</li>
              <li>Accessibility</li>
            </ul>
          </div>

        </div>

        {/* 🔥 COPYRIGHT */}
        <div className="mt-8 flex justify-between items-center text-sm text-gray-400">
          <h2 className="text-white font-bold text-lg">CourseHub</h2>
          <p>© 2026 CourseHub Inc.</p>
        </div>

      </div>

    </footer>
  );
}

export default Footer;