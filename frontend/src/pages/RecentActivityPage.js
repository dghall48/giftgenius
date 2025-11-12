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
import { useActivity } from "../ActivityContext";

export default function RecentActivityPage() {
  const { activities, deleteActivity, clearAllActivities, getActivitiesByType } = useActivity();
  const [filter, setFilter] = useState("all");

  // Icon mapping
  const iconMap = {
    gift_search: Search,
    recipient_added: Users,
    recipient_edited: Edit,
    recipient_deleted: Trash2,
    occasion_added: Calendar,
    occasion_deleted: Trash2,
    gift_found: Gift,
  };

  // Color mapping
  const colorMap = {
    gift_search: { gradient: "from-purple-500 to-pink-500", bg: "from-purple-100 to-pink-100" },
    recipient_added: { gradient: "from-blue-500 to-indigo-500", bg: "from-blue-100 to-indigo-100" },
    recipient_edited: { gradient: "from-yellow-500 to-orange-500", bg: "from-yellow-100 to-orange-100" },
    recipient_deleted: { gradient: "from-red-500 to-pink-500", bg: "from-red-100 to-pink-100" },
    occasion_added: { gradient: "from-pink-500 to-red-500", bg: "from-pink-100 to-red-100" },
    occasion_deleted: { gradient: "from-red-500 to-pink-500", bg: "from-red-100 to-pink-100" },
    gift_found: { gradient: "from-green-500 to-emerald-500", bg: "from-green-100 to-emerald-100" },
  };

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

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  const renderActivityGroup = (title, activities) => {
    if (activities.length === 0) return null;

    return (
      <div key={title} className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {title}
        </h3>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type] || Activity;
            const colors = colorMap[activity.type] || { 
              gradient: "from-gray-500 to-gray-600", 
              bg: "from-gray-100 to-gray-200" 
            };

            return (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      size={20}
                      className={`text-${colors.gradient.split('-')[1]}-600`}
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
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => deleteActivity(activity.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recent Activity
          </h1>
          <p className="text-gray-600">
            Track your gift-giving journey and past actions
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={clearAllActivities}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {filterTypes.map((filterType) => {
            const FilterIcon = filterType.icon;
            const count = filterType.id === 'all' 
              ? activities.length 
              : getActivitiesByType(filterType.id).length;
            
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
                {count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === filterType.id
                      ? "bg-white/20"
                      : "bg-gray-200"
                  }`}>
                    {count}
                  </span>
                )}
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
              {filter === 'all' ? 'No activity yet' : 'No activity of this type'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start using GiftGenius to see your activity here'
                : 'Try selecting a different filter to see more activities'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View All Activity
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}