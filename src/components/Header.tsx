import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  transparent?: boolean;
}

const Header = ({ transparent = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isScrolled ? "bg-bed-linen shadow-sm py-4" : transparent ? "bg-transparent py-6" : "bg-bed-linen py-6",
  );

  const navLinks = [
    { name: "Collections", href: "/#collections" },
    { name: "New Arrivals", href: "/#new-arrivals" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className={cn(headerClasses, "text-dark-chocolate")}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex-1 md:flex-none flex justify-start md:justify-center">
          <Link to="/" className="text-2xl font-light tracking-wider text-dark-chocolate">
            Roots Design
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm tracking-wide transition-colors hover:text-desert-sand"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-dark-chocolate">
          <button
            aria-label="Search"
            className="transition-colors hover:text-desert-sand"
          >
            <Search size={20} />
          </button>
          <Link
            to="/cart"
            className="relative transition-colors hover:text-desert-sand"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-dark-chocolate text-bed-linen text-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full overflow-hidden bg-bed-linen"
          >
            <nav className="container mx-auto px-4 py-6">
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="block py-2 text-sm tracking-wide text-dark-chocolate transition-colors hover:text-desert-sand"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
