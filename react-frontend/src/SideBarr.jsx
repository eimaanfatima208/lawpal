import React from "react";
import {
  LayoutDashboard,
  Users,
} from "lucide-react";
import './SideBarr.css';

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "User Management", icon: Users },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="sidebar-container">
      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              onClick={() => setCurrentPage(item.name)}
              className={`nav-menu-item ${currentPage === item.name ? "active" : ""}`}
            >
              <IconComponent className="nav-icon" />
              <span className="nav-text">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="footer-text">
          © 2025 LawPal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
