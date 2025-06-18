'use client';
import React, { useState } from 'react';
import { Menu, X, Building, Home, Star, ArrowRight, Search, Briefcase, Handshake } from 'lucide-react';

// Common styles used across the components
const colorStyles = `
  :root {
    --primary-color: #25790b;
    --secondary-color: #122b9c;
    --text-color: #ebf2fa;
    --text-color-dark: #0a192f;
  }
`;

//==============================================================================
// 1. REUSABLE NAVIGATION BAR COMPONENT
//==============================================================================
const NavLink = ({ href, children, isMobile, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
      isMobile
        ? 'text-gray-700 hover:bg-green-100'
        : 'text-[var(--text-color)] hover:bg-white/20'
    }`}
  >
    {children}
  </a>
);

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: "#", text: "Commercial", icon: <Building size={18} /> },
    { href: "#", text: "Residential", icon: <Home size={18} /> },
    { href: "#", text: "New & Popular", icon: <Star size={18} /> },
  ];

  return (
    <header className="w-full bg-[var(--primary-color)] shadow-md z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-[var(--text-color)]">
              PropertyHub
            </a>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[var(--text-color)] hover:bg-white/20 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 bg-white px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => <NavLink key={link.href} {...link} isMobile onClick={() => setIsMenuOpen(false)} />)}
          </div>
        </div>
      )}
    </header>
  );
};

//==============================================================================
// 2. LANDING PAGE CONTENT
//==============================================================================

const HeroSection = () => (
    <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-32">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-color-dark)] sm:text-5xl md:text-6xl">
                Find Your Next Property With <span className="text-[var(--primary-color)]">PropertyHub</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-gray-600 md:max-w-xl">
                Your seamless journey to buying, selling, or renting properties starts here. Explore thousands of listings with our powerful and easy-to-use platform.
            </p>
            <div className="mt-8 flex justify-center gap-3">
                <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-6 py-3 text-base font-medium text-white shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Explore Listings
                    <ArrowRight size={20} />
                </a>
                <a href="#" className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-[var(--primary-color)] shadow-md ring-1 ring-inset ring-gray-300 transition hover:bg-gray-100">
                    List Your Property
                </a>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: <Search size={32} className="text-[var(--primary-color)]" />,
            title: "Advanced Search",
            description: "Effortlessly find properties with our powerful filters. Search by location, price, size, and amenities to find exactly what you're looking for."
        },
        {
            icon: <Briefcase size={32} className="text-[var(--primary-color)]" />,
            title: "Commercial & Residential",
            description: "We cater to all needs, whether you're searching for a new family home, a downtown apartment, or the perfect space for your business."
        },
        {
            icon: <Handshake size={32} className="text-[var(--primary-color)]" />,
            title: "Expert Agents",
            description: "Connect with our network of experienced real estate agents who are ready to guide you through every step of the process."
        }
    ];

    return (
        <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--text-color-dark)] sm:text-4xl">Why Choose PropertyHub?</h2>
                    <p className="mt-4 text-lg text-gray-600">We are committed to making your property search simple, efficient, and successful.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                {feature.icon}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-[var(--text-color-dark)]">{feature.title}</h3>
                            <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-[var(--text-color-dark)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} PropertyHub. All rights reserved.</p>
        </div>
    </footer>
);

//==============================================================================
// 3. MAIN PAGE (`/app/page.js`)
//==============================================================================
export default function App() {
  return (
    <>
      <style>{colorStyles}</style>
      <div className="bg-white">
        <NavigationBar />
        <main>
            <HeroSection />
            <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
