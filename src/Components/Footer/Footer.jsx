import React from "react";
import './Footer.css'

export default function Footer() {
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    
    return (
    <>
    <footer>
        All Rights Reserved &copy; 2024 CookBook Maker.
        <p id="footer-logo" onClick={scrollToTop}>
            <code className="logo-symbol">🥘</code>
            </p>
            </footer>
            </>
            );
        }