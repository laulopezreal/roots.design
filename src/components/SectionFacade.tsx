import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "The Collection",
    description:
      "Explore our family of curated pieces that will bring harmony to every room.",
    href: "#collections",
  },
  {
    title: "Featured",
    description:
      "Be the first to experience the latest silhouettes fresh from our studio.",
    href: "#new-arrivals",
  },
  {
    title: "About",
    description:
      "Meet the artisans and values that shape our contemporary craft.",
    href: "#about",
  },
  {
    title: "Contact",
    description:
      "Connect with our team for bespoke recommendations and support.",
    href: "#contact",
  },
];

const SectionFacade = () => {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Discover Our World
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A glimpse into what is waiting for you at Roots
            Design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <motion.a
              key={section.title}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-white"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.4em] text-gray-400">
                    Section
                  </span>
                  <h3 className="mt-4 text-2xl font-light text-gray-900">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-medium text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
                  Explore
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFacade;
