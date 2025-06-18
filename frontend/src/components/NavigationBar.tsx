'use client';
import React, { useState } from 'react';
import { Menu, X, Building, Home, Star } from 'lucide-react';

// It's a good practice to define your colors in your tailwind.config.js,
// but for a self-contained component, we can add them via a style tag.
const colorStyles = `
  :root {
    --primary-color: #25790b;
    --secondary-color: #122b9c;
    --text-color: #ebf2fa;
    --text-color-dark: #0a192f;
  }
`;

// Helper component for navigation links to avoid repetition
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


export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/commercial", text: "Commercial", icon: <Building size={18} /> },
    { href: "/residential", text: "Residential", icon: <Home size={18} /> },
    { href: "/new", text: "New & Popular", icon: <Star size={18} /> },
  ];

  return (
    <>
      <style>{colorStyles}</style>
      <header className="w-full bg-[var(--primary-color)] shadow-md z-50 flex-shrink-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-[var(--text-color)]">
              PropertyHub
            </a>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[var(--text-color)] hover:bg-white/20 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 bg-white px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                isMobile
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span className="text-[var(--text-color-dark)]">{link.text}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
      </header>
    </>
  );
}