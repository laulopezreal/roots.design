import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Collections",
    description:
      "Explore lighting families curated to bring harmony to every room.",
    href: "#collections",
  },
  {
    title: "New Arrivals",
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
    <section className="w-full bg-bed-linen py-16 px-4 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-light text-dark-chocolate md:text-4xl">
            Discover Our World
          </h2>
          <p className="mx-auto max-w-2xl text-dark-chocolate/70">
            A curated glimpse into the experiences waiting for you at Roots
            Design. Choose a destination to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <motion.a
              key={section.title}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border border-vanilla-cream bg-vanilla-cream/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-desert-sand hover:bg-bed-linen"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-bed-linen via-transparent to-vanilla-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.4em] text-dark-chocolate/50">
                    Section
                  </span>
                  <h3 className="mt-4 text-2xl font-light text-dark-chocolate">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-sm text-dark-chocolate/70">
                    {section.description}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-medium text-dark-chocolate transition-colors duration-300 group-hover:text-desert-sand">
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
