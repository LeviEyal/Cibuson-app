// app/about/feedback-form.tsx
'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', { name, feedback });
    setSubmitted(true);
    setFeedback('');
    setName('');
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-900">שלחו לנו משוב</h2>
      </div>
      
      {submitted ? (
        <div className="text-green-600 text-center p-4 bg-green-50 rounded-lg">
          תודה על המשוב!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">שם</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="feedback" className="block text-gray-700 mb-2">המשוב שלך</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>שלח משוב</span>
          </button>
        </form>
      )}
    </>
  );
}