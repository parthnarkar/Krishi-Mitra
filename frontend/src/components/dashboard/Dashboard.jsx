import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaChartLine, FaWarehouse, FaLeaf, FaCalendarAlt, 
  FaBox, FaUsers, FaTruck, FaCog, FaBell, FaPlus, 
  FaArrowUp, FaArrowDown, FaExclamationTriangle, FaCheck
} from 'react-icons/fa';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const stats = [
    { id: 1, title: 'Total Sales', value: '₹32,450', trend: '+12%', icon: <FaChartLine />, iconClass: 'bg-gradient-primary' },
    { id: 2, title: 'Active Orders', value: '24', trend: '+8%', icon: <FaBox />, iconClass: 'bg-gradient-secondary' },
    { id: 3, title: 'Inventory Items', value: '152', trend: '+3%', icon: <FaWarehouse />, iconClass: 'bg-gradient-primary' },
    { id: 4, title: 'Customers', value: '86', trend: '+15%', icon: <FaUsers />, iconClass: 'bg-gradient-secondary' }
  ];

  const recentActivities = [
    { id: 1, title: 'New order received', description: 'Order #12345 from Rahul Sharma', time: '10 minutes ago', status: 'pending', icon: <FaBox /> },
    { id: 2, title: 'Shipment delivered', description: 'Order #12340 to Aryan Patel', time: '1 hour ago', status: 'completed', icon: <FaTruck /> },
    { id: 3, title: 'Low inventory alert', description: 'Organic Tomatoes (10 kg remaining)', time: '3 hours ago', status: 'warning', icon: <FaExclamationTriangle /> },
    { id: 4, title: 'New product added', description: 'Fresh Apples added to inventory', time: '6 hours ago', status: 'completed', icon: <FaLeaf /> },
  ];

  const quickActions = [
    { id: 1, title: 'Add Product', icon: <FaPlus />, color: 'bg-gradient-primary' },
    { id: 2, title: 'Process Orders', icon: <FaBox />, color: 'bg-gradient-secondary' },
    { id: 3, title: 'Manage Storage', icon: <FaWarehouse />, color: 'bg-gradient-primary' },
    { id: 4, title: 'View Calendar', icon: <FaCalendarAlt />, color: 'bg-gradient-secondary' },
  ];

  const upcomingDeliveries = [
    { id: 1, customer: 'Rahul Sharma', address: 'Mumbai, Maharashtra', date: 'Today', status: 'On the way' },
    { id: 2, customer: 'Priya Verma', address: 'Delhi, Delhi', date: 'Tomorrow', status: 'Scheduled' },
    { id: 3, customer: 'Amit Singh', address: 'Pune, Maharashtra', date: 'Sep 23, 2023', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20">
      <div className="container mx-auto px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Farmer Dashboard</h1>
            <p className="text-neutral-600">Welcome back! Here's what's happening with your farm.</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <button className="btn btn-outline relative">
                <FaBell className="mr-2" />
                <span>Notifications</span>
                <span className="absolute -top-2 -right-2 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            <div>
              <select 
                className="form-control bg-white border border-neutral-200 rounded-lg px-4 py-2 text-neutral-700"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id} 
              className="stats-card animate-fade-in" 
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`stats-icon ${stat.iconClass} text-white`}>
                  {stat.icon}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.trend.startsWith('+') ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                  {stat.trend.startsWith('+') ? <FaArrowUp className="inline mr-1 text-[10px]" /> : <FaArrowDown className="inline mr-1 text-[10px]" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-neutral-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-neutral-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section mb-10 animate-fade-in">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Quick Actions</h2>
          </div>
          <div className="dashboard-grid-4">
            {quickActions.map((action, index) => (
              <button 
                key={action.id} 
                className="card-dashboard flex justify-between items-center p-5 group hover-translate-y" 
                style={{ animationDelay: `${0.2 + 0.05 * index}s` }}
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-neutral-800">{action.title}</h3>
                  <p className="text-sm text-neutral-600">Tap to access</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${action.color} text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-all`}>
                  {action.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Recent Activities */}
          <div className="lg:col-span-2 card-dashboard animate-fade-in">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Recent Activities</h2>
              <Link to="/activities" className="text-primary-color hover:text-primary-dark font-medium">View All</Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="activity-item py-4" style={{ animationDelay: `${0.3 + 0.05 * index}s` }}>
                  <div className={`activity-icon ${
                    activity.status === 'completed' ? 'bg-success-light text-success' :
                    activity.status === 'pending' ? 'bg-warning-light text-warning' :
                    'bg-danger-light text-danger'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title text-neutral-800">{activity.title}</h4>
                    <p className="text-neutral-600 text-sm mb-2">{activity.description}</p>
                    <div className="activity-meta">
                      <span>{activity.time}</span>
                      <span className={`status-pill ${
                        activity.status === 'completed' ? 'status-active' :
                        activity.status === 'pending' ? 'status-pending' :
                        'status-inactive'
                      }`}>
                        {activity.status === 'completed' && <FaCheck className="mr-1" />}
                        {activity.status === 'pending' && <FaExclamationTriangle className="mr-1" />}
                        {activity.status === 'warning' && <FaExclamationTriangle className="mr-1" />}
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deliveries */}
          <div className="card-dashboard animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="dashboard-header">
              <h2 className="dashboard-title">Upcoming Deliveries</h2>
              <Link to="/deliveries" className="text-primary-color hover:text-primary-dark font-medium">View All</Link>
            </div>
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery, index) => (
                <div key={delivery.id} className="border border-neutral-100 rounded-lg p-4 hover:shadow-md transition-all" style={{ animationDelay: `${0.5 + 0.05 * index}s` }}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-neutral-800">{delivery.customer}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      delivery.status === 'On the way' ? 'bg-primary-bg text-primary-color' :
                      delivery.status === 'Scheduled' ? 'bg-info-light text-info' :
                      'bg-warning-light text-warning'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 mb-1">
                    <FaHome className="inline-block mr-1" /> {delivery.address}
                  </div>
                  <div className="text-sm text-neutral-500">
                    <FaCalendarAlt className="inline-block mr-1" /> {delivery.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="dashboard-grid-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Inventory Status */}
          <div className="card-dashboard">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Inventory Status</h2>
              <Link to="/inventory" className="text-primary-color hover:text-primary-dark font-medium">Manage</Link>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Organic Tomatoes</span>
                <div className="flex items-center">
                  <span className="text-neutral-800 font-medium mr-2">45 kg</span>
                  <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-color" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Fresh Potatoes</span>
                <div className="flex items-center">
                  <span className="text-neutral-800 font-medium mr-2">120 kg</span>
                  <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-color" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Organic Rice</span>
                <div className="flex items-center">
                  <span className="text-neutral-800 font-medium mr-2">80 kg</span>
                  <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-color" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Red Chillies</span>
                <div className="flex items-center">
                  <span className="text-neutral-800 font-medium mr-2">10 kg</span>
                  <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-danger" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Status */}
          <div className="card-dashboard">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Storage Status</h2>
              <Link to="/cold-storage" className="text-primary-color hover:text-primary-dark font-medium">Book Storage</Link>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Cold Storage A</span>
                  <span className="text-neutral-800 font-medium">65% Used</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-color rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Warehouse B</span>
                  <span className="text-neutral-800 font-medium">42% Used</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-color rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div className="bg-primary-bg rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="rounded-full p-2 bg-primary-color text-white mr-3">
                    <FaWarehouse />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">Cold Storage Available</h4>
                    <p className="text-neutral-600 text-sm">Book additional cold storage space for your produce at competitive rates.</p>
                    <button className="mt-2 text-primary-color hover:text-primary-dark font-medium text-sm">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 