import React, { useState } from "react";
import {
  Activity,
  Gift,
  Users,
  Calendar,
  Search,
  Trash2,
  Edit,
} from "lucide-react";

export default function RecentActivityPage() {
  const [filter, setFilter] = useState("all");

  // Mock activity data - this will come from your backend later
  const activities = [
    {
      id: 1,
      type: "gift_search",
      icon: Search,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-100 to-pink-100",
      title: "Searched for gift ideas",
      description: "Found gifts for John Smith - Birthday",
      timestamp: "2 hours ago",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      type: "recipient_added",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-100 to-indigo-100",
      title: "Added new recipient",
      description: "Sarah Johnson - Best Friend",
      timestamp: "5 hours ago",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      type: "occasion_added",
      icon: Calendar,
      color: "from-pink-500 to-red-500",
      bgColor: "from-pink-100 to-red-100",
      title: "Added occasion",
      description: "Mom - Christmas on Dec 25, 2025",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      type: "gift_found",
      icon: Gift,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-100 to-emerald-100",
      title: "Selected a gift",
      description: "Wireless Headphones for John Smith",
      timestamp: "1 day ago",
      date: new Date(Date.now() - 26 * 60 * 60 * 1000),
    },
    {
      id: 5,
      type: "recipient_edited",
      icon: Edit,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-100 to-orange-100",
      title: "Updated recipient profile",
      description: "Modified interests for Dad",
      timestamp: "2 days ago",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 6,
      type: "gift_search",
      icon: Search,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-100 to-pink-100",
      title: "Searched for gift ideas",
      description: "Found gifts for Sarah Johnson - Anniversary",
      timestamp: "3 days ago",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 7,
      type: "recipient_added",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-100 to-indigo-100",
      title: "Added new recipient",
      description: "Emily - Sister",
      timestamp: "4 days ago",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: 8,
      type: "occasion_added",
      icon: Calendar,
      color: "from-pink-500 to-red-500",
      bgColor: "from-pink-100 to-red-100",
      title: "Added occasion",
      description: "Dad - Retirement Party on Nov 10, 2025",
      timestamp: "5 days ago",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const filterTypes = [
    { id: "all", label: "All Activity", icon: Activity },
    { id: "gift_search", label: "Gift Searches", icon: Search },
    { id: "recipient_added", label: "Recipients", icon: Users },
    { id: "occasion_added", label: "Occasions", icon: Calendar },
    { id: "gift_found", label: "Gifts Found", icon: Gift },
  ];

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  // Group activities by date
  const groupByDate = (activities) => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    activities.forEach((activity) => {
      const activityDate = new Date(activity.date);
      const activityDay = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate()
      );

      if (activityDay.getTime() === today.getTime()) {
        groups.today.push(activity);
      } else if (activityDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(activity);
      } else if (activityDate >= weekAgo) {
        groups.thisWeek.push(activity);
      } else {
        groups.older.push(activity);
      }
    });

    return groups;
  };

  const groupedActivities = groupByDate(filteredActivities);

  const renderActivityGroup = (title, activities) => {
    if (activities.length === 0) return null;

    return (
      <div key={title} className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {title}
        </h3>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      size={20}
                      className={`bg-gradient-to-br ${activity.color} bg-clip-text text-transparent`}
                      style={{ WebkitTextFillColor: "transparent" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>

                  {/* Action Menu */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recent Activity
        </h1>
        <p className="text-gray-600">
          Track your gift-giving journey and past actions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {filterTypes.map((filterType) => {
            const FilterIcon = filterType.icon;
            return (
              <button
                key={filterType.id}
                onClick={() => setFilter(filterType.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === filterType.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FilterIcon size={18} />
                <span className="text-sm">{filterType.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Search size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.type === "gift_search").length}
              </p>
              <p className="text-xs text-gray-600">Gift Searches</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.type === "recipient_added").length}
              </p>
              <p className="text-xs text-gray-600">Recipients Added</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
              <Calendar size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.type === "occasion_added").length}
              </p>
              <p className="text-xs text-gray-600">Occasions Added</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <Gift size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter((a) => a.type === "gift_found").length}
              </p>
              <p className="text-xs text-gray-600">Gifts Found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        {renderActivityGroup("Today", groupedActivities.today)}
        {renderActivityGroup("Yesterday", groupedActivities.yesterday)}
        {renderActivityGroup("This Week", groupedActivities.thisWeek)}
        {renderActivityGroup("Older", groupedActivities.older)}

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Activity size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start using GiftGenius to see your activity here
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Find Your First Gift
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
