import React from "react";
import '../Pages/UserManagement.css';

const lawyerAccounts = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    specialization: "Corporate Law",
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima.ali@example.com",
    specialization: "Family Law",
  },
  {
    id: 3,
    name: "Usman Tariq",
    email: "usman.tariq@example.com",
    specialization: "Criminal Defense",
  },
  {
    id: 4,
    name: "Sana Raza",
    email: "sana.raza@example.com",
    specialization: "Intellectual Property",
  },
  {
    id: 5,
    name: "Maryam Anwar",
    email: "maryam.anwar@example.com",
    specialization: "Criminal Property",
  },
];

const clientAccounts = [
  {
    id: 1,
    name: "Sara Javed",
    email: "sara.javed@example.com",
    phone: "+92 300 1234567",
  },
  {
    id: 2,
    name: "Ali Hassan",
    email: "ali.hassan@example.com",
    phone: "+92 321 9876543",
  },
  {
    id: 3,
    name: "Maria Qureshi",
    email: "maria.q@example.com",
    phone: "+92 333 5550011",
  },
];

export default function UserManagement() {
  return (
    <div className="user-management">
      <h1 className="user-management-title">User Management</h1>

      {/* Lawyer Accounts Section */}
      <div className="table-card">
        <h2 className="table-title">Lawyer Accounts</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {lawyerAccounts.map((lawyer) => (
                <tr key={lawyer.id} className="table-row">
                  <td className="table-cell">{lawyer.name}</td>
                  <td className="table-cell">{lawyer.email}</td>
                  <td className="table-cell">{lawyer.specialization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Accounts Section */}
      <div className="table-card">
        <h2 className="table-title">Users Accounts</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
              </tr>
            </thead>
            <tbody>
              {clientAccounts.map((client) => (
                <tr key={client.id} className="table-row">
                  <td className="table-cell">{client.name}</td>
                  <td className="table-cell">{client.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
