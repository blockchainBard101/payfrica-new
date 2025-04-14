'use client';
import { useState } from 'react';
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
                <img src={PayfricaNavLogo.src} className='company-nav-logo' alt="Payfrica Logo" />
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
                        <img src={ProfileDP.src} alt="Profile" />
                        <p className='profile-name'>John Doe</p>
                        <FaChevronDown className="icon" />
                    </div>
                </div>
            </div>

            <div className="mobile-nav">
                <FaBars className="icon menu-icon" onClick={toggleMobileMenu} />
                <div className="profile-icon">
                    <FaBell className="icon" />
                    <div className="profile-img">
                        <img src={ProfileDP.src} alt="Profile" />
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
