import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  FaTachometerAlt,
  FaNewspaper,
  FaUsers,
  FaFolder,
  FaCog,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const menu = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <FaTachometerAlt />,
    },
    {
      name: 'Posts',
      path: '/admin/posts',
      icon: <FaNewspaper />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <FaUsers />,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <FaFolder />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white hidden md:block">

      {/* LOGO */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-orange-500">
          TopNews Admin
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Management Dashboard
        </p>
      </div>

      {/* MENU */}
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;