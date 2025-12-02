import React, { useState } from "react";
import { X, Mail, Copy, CheckCircle, Info } from "lucide-react";

export default function EmailFormModal({ isOpen, onClose, user }) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  if (!isOpen) return null;

  const generateToken = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleGenerateLink = () => {
    const token = generateToken();
    const link = `${
      window.location.origin
    }/recipient-form?token=${token}&sender=${user?.firstName || "User"}`;
    setGeneratedLink(link);
    return { link, token };
  };

  const handleCopyLink = () => {
    const { link } = handleGenerateLink();
    navigator.clipboard.writeText(link);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!recipientName.trim() || !recipientEmail.trim()) {
      alert("Please fill in recipient name and email");
      return;
    }

    setIsSending(true);

    try {
      const { link, token } = handleGenerateLink();

      const response = await fetch(
        "http://localhost:5001/api/send-form-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: recipientEmail.trim(),
            recipientName: recipientName.trim(),
            senderName: user?.firstName || "Someone",
            message: message.trim(),
            formLink: link,
            token: token,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      alert(`✅ Email sent successfully to ${recipientEmail}!`);

      // Reset form
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
      setGeneratedLink("");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("❌ Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Send Preference Form</h2>
                <p className="text-blue-100 text-sm">
                  Let recipients share their preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="m-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex gap-3">
            <Info className="text-blue-600 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Send a personalized email to your gift recipient</li>
                <li>
                  They fill out their preferences (interests, sizes, wishlist)
                </li>
                <li>Use their responses to find the perfect gift</li>
                <li>Or just generate a link and send it yourself</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Name *
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email *
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g., sarah@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Hey! Your birthday is coming up and I want to get you something you'll love..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            />
          </div>

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-semibold text-green-900 mb-2">
                ✅ Link Generated!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {showCopied ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCopyLink}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Copy size={18} />
              <span>Just Generate Link</span>
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail size={18} />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
