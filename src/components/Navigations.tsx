'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ProfileDP, PayfricaNavLogo } from '@/imports';
import { FaBell, FaBars, FaChevronDown, FaTimes } from 'react-icons/fa';

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="desktop-nav">
                <Image
                    src={PayfricaNavLogo}
                    alt="Payfrica Logo"
                    className="company-nav-logo"
                    width={100}
                    height={40}
                    priority
                />
                <ul className="nav-links">
                    <li>Dashboard</li>
                    <li>Pay</li>
                    <li>Bridge</li>
                    <li>Saving Circle</li>
                    <li>Payfrica Card</li>
                </ul>
                <div className="profile">
                    <FaBell className="icon notis-icon" />
                    <div className="profile-img">
                        <Image
                            src={ProfileDP}
                            alt="Profile"
                            width={32}
                            height={32}
                        />
                        <p className="profile-name">John Doe</p>
                        <FaChevronDown className="icon" />
                    </div>
                </div>
            </div>

            <div className="mobile-nav">
                <FaBars className="icon menu-icon" onClick={toggleMobileMenu} />
                <div className="profile-icon">
                    <FaBell className="icon" />
                    <div className="profile-img">
                        <Image
                            src={ProfileDP}
                            alt="Profile"
                            width={32}
                            height={32}
                        />
                        <FaChevronDown className="icon" />
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

export default Navigation;
