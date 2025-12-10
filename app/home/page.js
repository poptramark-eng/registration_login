"use client";

import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300`}
      >
        <div className="p-4 font-bold text-xl">Dashboard</div>

        <nav className="mt-6">
          <ul className="space-y-2">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Overview
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Users
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Analytics
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Toggle Sidebar
        </button>

        <h1 className="text-3xl font-bold mb-6">Welcome Back 👋</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-3xl font-bold mt-2">1,240</p>
          </div>

          <div className="p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">Page Views</h2>
            <p className="text-3xl font-bold mt-2">32,500</p>
          </div>

          <div className="p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-3xl font-bold mt-2">$4,200</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-10 p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">
            This is where you can display logs, analytics, or user activity.
          </p>
        </div>
      </main>
    </div>
  );
}
