import React, { useState } from "react";
import { Calendar, Plus, Gift, ChevronLeft, ChevronRight } from "lucide-react";

export default function OccasionCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock occasions data - this will come from your backend later
  const occasions = [
    {
      id: 1,
      recipientName: "John Smith",
      occasion: "Birthday",
      date: "2025-10-15",
      daysUntil: 5,
      icon: "🎂",
    },
    {
      id: 2,
      recipientName: "Sarah Johnson",
      occasion: "Anniversary",
      date: "2025-10-22",
      daysUntil: 12,
      icon: "💐",
    },
    {
      id: 3,
      recipientName: "Mom",
      occasion: "Christmas",
      date: "2025-12-25",
      daysUntil: 76,
      icon: "🎄",
    },
    {
      id: 4,
      recipientName: "Dad",
      occasion: "Retirement Party",
      date: "2025-11-10",
      daysUntil: 31,
      icon: "🎉",
    },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Check if a date has occasions
  const getOccasionsForDate = (day) => {
    if (!day) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return occasions.filter((occ) => occ.date === dateStr);
  };

  // Check if date is today
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil <= 7) return "from-red-500 to-pink-500";
    if (daysUntil <= 14) return "from-orange-500 to-yellow-500";
    if (daysUntil <= 30) return "from-blue-500 to-indigo-500";
    return "from-purple-500 to-pink-500";
  };

  const calendarDays = getCalendarDays();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Occasion Calendar
        </h1>
        <p className="text-gray-600">Never miss an important date again</p>
      </div>

      {/* Add New Occasion Button */}
      <button className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
        <Plus size={20} />
        <span>Add New Occasion</span>
      </button>

      {/* Calendar View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToToday}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1"
            >
              Today
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayOccasions = getOccasionsForDate(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-24 p-2 rounded-lg border-2 transition-all ${
                  day
                    ? isTodayDate
                      ? "border-purple-500 bg-purple-50"
                      : dayOccasions.length > 0
                      ? "border-pink-200 bg-pink-50 hover:border-pink-300 cursor-pointer"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    : "border-transparent"
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isTodayDate
                          ? "text-purple-600"
                          : dayOccasions.length > 0
                          ? "text-pink-600"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayOccasions.slice(0, 2).map((occasion) => (
                        <div
                          key={occasion.id}
                          className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded truncate"
                          title={`${occasion.recipientName} - ${occasion.occasion}`}
                        >
                          <span className="mr-1">{occasion.icon}</span>
                          {occasion.recipientName}
                        </div>
                      ))}
                      {dayOccasions.length > 2 && (
                        <div className="text-xs text-gray-600 font-medium px-2">
                          +{dayOccasions.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-50"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-pink-200 bg-pink-50"></div>
            <span className="text-sm text-gray-600">Has Occasions</span>
          </div>
        </div>
      </div>

      {/* All Occasions Timeline View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            All Occasions Timeline
          </h2>
        </div>

        <div className="space-y-4">
          {occasions
            .sort((a, b) => a.daysUntil - b.daysUntil)
            .map((occasion, index) => (
              <div key={occasion.id} className="flex items-center gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${getUrgencyColor(
                      occasion.daysUntil
                    )}`}
                  ></div>
                  {index < occasions.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200"></div>
                  )}
                </div>

                {/* Occasion info */}
                <div className="flex-1 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{occasion.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {occasion.occasion}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {occasion.recipientName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(occasion.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p
                        className={`text-xs font-semibold bg-gradient-to-r ${getUrgencyColor(
                          occasion.daysUntil
                        )} bg-clip-text text-transparent`}
                      >
                        {occasion.daysUntil}{" "}
                        {occasion.daysUntil === 1 ? "day" : "days"} away
                      </p>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <Gift size={16} />
                    <span>Find Gift Ideas</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
