"use client";
import { useState } from "react";
import Image from "next/image";
import { FaBell, FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="desktop-nav">
        <Image
          src={"/Payfrica_Logo_Logo_Deep_red.png"}
          alt="Payfrica Logo"
          className="company-nav-logo"
          width={100}
          height={60}
          priority
        />
        <ul className="nav-links">
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/payfricacard">Payfrica card</a>
          </li>
          <li>
            <a href="/pools">Pools</a>
          </li>
          <li>
            <a href="/pools">Savings circle</a>
          </li>
        </ul>
        <div className="profile">
          <a href="/profile" className="profile-img">
            <RxAvatar style={{ fontSize: "30px" }} />
          </a>
        </div>
      </div>

      <div className="mobile-nav">
        <FaBars className="icon menu-icon" onClick={toggleMobileMenu} />
        <div className="profile-icon">
          <div className="profile-img">
            <RxAvatar style={{ fontSize: "30px" }} />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <FaTimes className="close-icon" onClick={toggleMobileMenu} />
          <ul className="mobile-nav-links">
            <li>Dashboard</li>
            <li>Pay</li>
            <li>Bridge</li>
            <li>Saving Circle</li>
            <li>Payfrica Card</li>
          </ul>
        </div>
      )}
    </nav>
  );
};
