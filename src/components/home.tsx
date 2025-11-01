import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import HeroSection from "./HeroSection";
import ProductGrid from "./ProductGrid";
import ProductCard from "./ProductCard";
import SectionFacade from "./SectionFacade";
import CloudinaryImage from "./CloudinaryImage";

const newArrivalProducts = [
  {
    id: "na-1",
    name: "Opaline Sphere Pendant",
    brand: "Roots Atelier",
    price: 325,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
  },
  {
    id: "na-2",
    name: "Sculpted Marble Sconce",
    brand: "Lustre House",
    price: 285,
    image:
      "https://images.unsplash.com/photo-1505692069463-26a9ebc09a61?w=800&q=80",
  },
  {
    id: "na-3",
    name: "Velvet Drum Table Lamp",
    brand: "Foundry Co.",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: "na-4",
    name: "Linear Cascade Chandelier",
    brand: "Maison Arc",
    price: 640,
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80",
  },
];

const aboutHighlights = [
  {
    title: "Selected with Passion",
    description:
      "Every selected piece begins as a investigation process. Our team searches for the best pieces to translate those ideas into pieces that are both modern and enduring.",
  },
  {
    title: "Sustainable Materials",
    description:
      "We partner with responsible suppliers and promote a circular marketplace. We prioritised pieces with metals, FSC-certified woods, and low-impact finishes to ensure beauty never compromises the planet.",
  },
  {
    title: "Design Services",
    description:
      "From concept to reality, our team collaborates with designers to elevate every room's atmosphere.",
  },
];

const HomePage = () => {
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <HeroSection onCtaClick={() => handleNavigate("collections")} />

        <SectionFacade />

        <ProductGrid
          id="collections"
          title="The Collection"
          subtitle="Discover our curated collection, where each piece counts. You won't regret it!"
        />

        <section
          id="new-arrivals"
          className="w-full bg-gray-50 py-16 px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                Featured
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fresh and featured pieces for you: treat your spaces and celebrate
                materiality, proportion, and the artistry of design.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {newArrivalProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    image={product.image}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="w-full bg-white py-16 px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                About Roots Design
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We select pieces that feel at once refined and soulful,
                blending modern engineering with timeless craft.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <motion.article
                id="our-story"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl"
              >
                {/* <img
                  src="https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=1200&q=80"
                  alt="Designers collaborating in a studio"
                  className="h-full w-full object-cover"
                /> */}
                <CloudinaryImage
                  publicId="web_deco/storage_room_1.jpg"
                  alt="Storage room with design items"
                  aspect="4:5"                             // matches the wrapper on mobile
                  sizes="(max-width:1024px) 100vw, 50vw"   // responsive hint
                  className="w-full h-full object-cover"
                  priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="text-xs uppercase tracking-[0.4em] text-white/70">
                    Our Story
                  </span>
                  <h3 className="mt-4 text-3xl font-light">Rooted in Craft</h3>
                  <p className="mt-3 text-sm text-white/80">
                    What began as a small hobby to decorate my home has grown into a
                    multidisciplinary studio, where each piece is a dialogue between
                    heritage craftsmanship and contemporary design.
                  </p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center text-sm font-medium text-white transition-colors hover:text-gray-200"
                  >
                    Connect with our team
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </a>
                </div>
              </motion.article>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                {aboutHighlights.map((highlight) => (
                  <div key={highlight.title} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-2xl font-light text-gray-900">
                      {highlight.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                ))}

                <div className="rounded-3xl bg-gray-900 p-8 text-white">
                  <h4 className="text-xl font-light">See it for yourself</h4>
                  <p className="mt-3 text-sm text-white/80">
                    Experience and discover the piece that you falled for in person by scheduling a visit.
                  </p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center text-sm font-medium text-white/90 hover:text-white"
                  >
                    Book an appointment
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full bg-gray-50 py-16 px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                Contact
              </h2>
              <p className="text-gray-600 mb-8">
                Whether you&apos;re designing a new space or refreshing a single
                room, we&apos;re here to help. Reach out for product guidance,
                trade partnerships, or custom commissions.
              </p>

              <div className="space-y-6 text-sm text-gray-700">
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.3em]">
                    Visit
                  </h3>
                  <p className="mt-2">
                    245 Mercer Street<br />
                    Suite 210<br />
                    New York, NY 10012
                  </p>
                </div> */}
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.3em]">
                    Call
                  </h3>
                  <p className="mt-2">(212) 555-0198</p>
                </div> */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.3em]">
                    Email
                  </h3>
                  <p className="mt-2">hello@rootsdesign.com</p>
                </div>
                {/* <div> 
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.3em]">
                    Hours
                  </h3>
                  <p className="mt-2">
                    Monday – Friday: 10am – 6pm
                    <br />
                    Saturday: 11am – 4pm
                  </p>
                </div> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-white p-8 shadow-lg shadow-gray-200/40"
            >
              <h3 className="text-xl font-light text-gray-900 mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-gray-500">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us about your project"
                    className="mt-2 h-32 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-800"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </motion.main>

      <footer className="bg-gray-900 text-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-light mb-4">Roots Design</h3>
            <p className="text-gray-400 mb-6">
              Elevating spaces with premium design Furniture.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Pinterest</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  The Collection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Featured Pieces
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sale
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Craftsmanship
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sustainability
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Press
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Care Instructions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto pt-8 mt-8 border-t border-gray-800 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2023 Roots Design. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
