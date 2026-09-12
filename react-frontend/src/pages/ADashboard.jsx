import React from "react";
import { Users, Briefcase, UserCheck, Activity, Gavel } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import '../Pages/ADashboard.css';

export default function ADashboard() {
  const stats = [
    { title: "Total Users", value: 1245, change: "+15%", description: "Across all roles", icon: Users },
    { title: "Total Lawyers", value: 340, change: "+5", description: "Including pending approvals", icon: Gavel },
    { title: "Total Clients", value: 905, change: "-2%", description: "Active and registered", icon: UserCheck },
    { title: "Active Users (24h)", value: 450, change: "+10%", description: "Currently online or recently active", icon: Activity },
  ];

  const searchData = [
    { name: "Family Law", searches: 180 },
    { name: "Criminal Cases", searches: 150 },
    { name: "Property Law", searches: 120 },
    { name: "Corporate Law", searches: 95 },
    { name: "Environmental Law", searches: 45 },
  ];

  const activityData = [
    { day: "Mon", logins: 140, registrations: 20 },
    { day: "Tue", logins: 165, registrations: 25 },
    { day: "Wed", logins: 155, registrations: 22 },
    { day: "Thu", logins: 190, registrations: 30 },
    { day: "Fri", logins: 220, registrations: 35 },
    { day: "Sat", logins: 170, registrations: 18 },
    { day: "Sun", logins: 150, registrations: 15 },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">
        Overview of LawPal platform performance and user engagement.
      </p>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <p className="stat-label">{item.title}</p>
                <h2 className="stat-value">{item.value.toLocaleString()}</h2>
                <p className="stat-description">{item.description}</p>
                <span className={`stat-change ${item.change.startsWith("-") ? "negative" : "positive"}`}>
                  {item.change.startsWith("-") ? "↓" : "↑"} {item.change}
                </span>
              </div>
              <IconComponent className="stat-icon" />
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">
            Most Searched Legal Sections
          </h3>
          <p className="chart-subtitle">
            Top legal topics queried by users over the last month.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={searchData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
              <XAxis 
                dataKey="name" 
                interval={0}
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="searches" fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-legend">
            <span className="legend-square"></span>
            Searches
          </p>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Daily User Activity</h3>
          <p className="chart-subtitle">
            New registrations and active logins over the past week.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={activityData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line dataKey="logins" stroke="#023020" strokeWidth={2} />
              <Line dataKey="registrations" stroke="#00A36C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="chart-legends">
            <div className="legend-item">
              <span className="legend-dot login-dot"></span>
              <span className="legend-text">Login</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot registration-dot"></span>
              <span className="legend-text">Registration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
