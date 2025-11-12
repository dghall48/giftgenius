import React, { useState } from "react";
import { Calendar, Plus, Gift, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useOccasions } from "../OccasionContext";
import { useRecipients } from "../RecipientContext";
import { useActivity } from "../ActivityContext";

export default function OccasionCalendarPage() {
  const { occasions, addOccasion, deleteOccasion } = useOccasions();
  const { recipients } = useRecipients();
  const { logActivity } = useActivity();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    recipientId: "",
    recipientName: "",
    occasion: "",
    date: "",
    icon: "🎁",
  });

  const occasionIcons = [
    { value: "🎂", label: "Birthday" },
    { value: "🎄", label: "Christmas" },
    { value: "💐", label: "Anniversary" },
    { value: "💕", label: "Valentine's" },
    { value: "🎓", label: "Graduation" },
    { value: "💝", label: "Wedding" },
    { value: "🎉", label: "Party" },
    { value: "🏠", label: "Housewarming" },
    { value: "🐰", label: "Easter" },
    { value: "🕎", label: "Hanukkah" },
    { value: "🎁", label: "Other" },
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate days until occasion
  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const occasionDate = new Date(dateString);
    occasionDate.setHours(0, 0, 0, 0);
    const diffTime = occasionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Add days until to each occasion
  const occasionsWithDays = occasions.map(occ => ({
    ...occ,
    daysUntil: getDaysUntil(occ.date),
  }));

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
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
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil < 0) return "from-gray-400 to-gray-500"; // Past
    if (daysUntil <= 7) return "from-red-500 to-pink-500";
    if (daysUntil <= 14) return "from-orange-500 to-yellow-500";
    if (daysUntil <= 30) return "from-blue-500 to-indigo-500";
    return "from-purple-500 to-pink-500";
  };

  const handleAddOccasion = (e) => {
    e.preventDefault();
    
    try {
      // Create occasion
      const newOccasion = addOccasion({
        recipientId: formData.recipientId || null,
        recipientName: formData.recipientName,
        occasion: formData.occasion,
        date: formData.date,
        icon: formData.icon,
      });

      // Log activity
      logActivity({
        type: 'occasion_added',
        title: 'Added occasion',
        description: `${formData.recipientName} - ${formData.occasion} on ${new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      });

      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        recipientId: "",
        recipientName: "",
        occasion: "",
        date: "",
        icon: "🎁",
      });

      alert("Occasion added successfully!");
    } catch (error) {
      console.error("Error adding occasion:", error);
      alert("Failed to add occasion. Please try again.");
    }
  };

  const handleDeleteOccasion = (occasion) => {
    if (window.confirm(`Are you sure you want to delete ${occasion.occasion} for ${occasion.recipientName}?`)) {
      deleteOccasion(occasion.id);
      
      // Log activity
      logActivity({
        type: 'occasion_deleted',
        title: 'Deleted occasion',
        description: `${occasion.recipientName} - ${occasion.occasion}`,
      });
    }
  };

  const handleRecipientSelect = (e) => {
    const recipientId = e.target.value;
    if (recipientId) {
      const recipient = recipients.find(r => r.id === recipientId);
      if (recipient) {
        setFormData(prev => ({
          ...prev,
          recipientId: recipient.id,
          recipientName: `${recipient.firstName} ${recipient.lastName}`,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        recipientId: "",
        recipientName: "",
      }));
    }
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
      <button 
        onClick={() => setShowAddModal(true)}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <Plus size={20} />
        <span>Add New Occasion</span>
      </button>

      {/* Add Occasion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add New Occasion</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddOccasion} className="space-y-4">
              {/* Select from Recipients */}
              {recipients.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Recipient (Optional)
                  </label>
                  <select
                    value={formData.recipientId}
                    onChange={handleRecipientSelect}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  >
                    <option value="">-- or enter name below --</option>
                    {recipients.map(recipient => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.firstName} {recipient.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Enter name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {/* Occasion Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occasion
                </label>
                <input
                  type="text"
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g., Birthday, Anniversary"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {occasionIcons.map(icon => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon.value })}
                      className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                        formData.icon === icon.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      title={icon.label}
                    >
                      {icon.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Add Occasion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        {occasionsWithDays.length > 0 ? (
          <div className="space-y-4">
            {occasionsWithDays
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
                    {index < occasionsWithDays.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    )}
                  </div>

                  {/* Occasion info */}
                  <div className="flex-1 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
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
                      <div className="text-right flex items-center gap-3">
                        <div>
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
                            {occasion.daysUntil < 0
                              ? `${Math.abs(occasion.daysUntil)} ${Math.abs(occasion.daysUntil) === 1 ? 'day' : 'days'} ago`
                              : occasion.daysUntil === 0
                              ? 'Today!'
                              : `${occasion.daysUntil} ${occasion.daysUntil === 1 ? 'day' : 'days'} away`
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteOccasion(occasion)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete occasion"
                        >
                          <X size={20} />
                        </button>
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
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Calendar size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No occasions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first occasion to keep track of important dates
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Add Your First Occasion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}