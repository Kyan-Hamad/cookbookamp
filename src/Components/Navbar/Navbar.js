import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '../../amplifyconfiguration.json';

Amplify.configure(config);

function Navbar({signOut}) {
  const navigateTo = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavigation = (route) => {
    navigateTo(route);
    setIsNavCollapsed(true); 
  };


  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <p className="navbar-brand" onClick={() => handleNavigation("/")}>
        <code className="logo-symbol"> 🥘 CookBook Maker</code>
      </p>
      <button
        className="navbar-toggler"
        type="button"
        onClick={handleNavToggle} 
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse justify-content-end`}
      >
        <ul className="navbar-nav">
          {withAuthenticator ? (
            <>
              <li className="nav-item">
                <p className="nav-link" onClick={() => handleNavigation("/")}>
                  <span id="dashboard">Dashboard</span>
                </p>
              </li>
              {/* <li className="nav-item">
                <p className="nav-link" onClick={() => handleNavigation("/profile")}>
                  <span id="profile">Profile</span>
                </p>
              </li> */}
              <li className="nav-item">
                <p className="nav-link" onClick={signOut}>
                  <span id="logout">Logout</span>
                </p>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <p className="nav-link" onClick={signOut}>
                  <span id="login">Login</span>
                </p>
              </li>
              <li className="nav-item">
                <p className="nav-link" onClick={signOut}>
                  <span id="register">Register</span>
                </p>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default withAuthenticator(Navbar);