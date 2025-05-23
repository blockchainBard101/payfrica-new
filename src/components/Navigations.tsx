"use client";
import { useState } from "react";
import Image from "next/image";
import {
  FaHome,
  FaCreditCard,
  FaUsers,
  FaPiggyBank,
  FaBars,
  FaInfoCircle,
} from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <FaHome /> },
  { href: "/payfricacard", label: "Payfrica card", icon: <FaCreditCard /> },
  { href: "/pools", label: "Pools", icon: <FaUsers /> },
  { href: "/savings", label: "Savings circle", icon: <FaPiggyBank /> },
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="navbar desktop-navbar">
        <div className="nav-left">
          <Image
            src="/PayfricaNavLogo.png"
            alt="Payfrica Logo"
            className="company-nav-logo"
            width={120}
            height={60}
            priority
          />
        </div>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="profile">
          <a href="/profile" className="profile-img">
            <RxAvatar style={{ fontSize: "32px" }} />
          </a>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="mobile-topbar">
        <FaBars className="icon menu-icon" onClick={toggleMobileMenu} />
        <Image
          src="/PayfricaNavLogo.png"
          alt="Payfrica Logo"
          className="mobile-logo"
          width={120}
          height={60}
        />
        <FaInfoCircle className="icon info-icon" />
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`mobile-nav-link${
              pathname === link.href ? " active" : ""
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
