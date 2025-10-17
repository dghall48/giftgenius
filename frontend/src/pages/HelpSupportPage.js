import React from "react";
import { HelpCircle } from "lucide-react";

export default function HelpSupportPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How does GiftGenius work?",
          a: "GiftGenius uses AI to analyze recipient information and suggest personalized gift ideas based on their interests, age, gender, and the occasion.",
        },
        {
          q: "Is GiftGenius free to use?",
          a: "Yes! GiftGenius offers a free tier with basic features. Premium features are available with our subscription plans.",
        },
        {
          q: "How do I add a new recipient?",
          a: 'Go to the Home page, fill out the "Who are you shopping for?" form, and click "Save Recipient Profile" to store their information for future use.',
        },
      ],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Help & Support
        </h1>
        <p className="text-gray-600">
          Find answers to common questions or get in touch with us
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        {faqs.map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle size={24} className="text-purple-600" />
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq, qIdx) => (
                <details key={qIdx} className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    <svg
                      className="w-5 h-5 text-gray-600 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-3 p-4 text-gray-600">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Still need help?
        </h2>
        <p className="text-gray-600 mb-6">
          Send us a message and we'll get back to you as soon as possible.
        </p>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              placeholder="How can we help?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              placeholder="Describe your issue or question..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
