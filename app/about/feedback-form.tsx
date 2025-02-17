'use client';

import { useState } from 'react';
import { Send, MessageSquare, LoaderCircleIcon } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedback = useAction(api.feedbacks.sendFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      
      await sendFeedback({ message: feedback });
      console.log('Feedback submitted:', { name, feedback });
      setSubmitted(true);
      setFeedback('');
    } catch (error) {
      console.error(error);
      toast.error("שגיאה בשליחת הטופס")
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold ">שלחו לנו משוב</h2>
      </div>
      
      {submitted ? (
        <div className="text-green-600 text-center p-4 bg-green-50 rounded-lg">
          תודה על המשוב!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-gray-700 mb-2">המשוב שלך</label>

          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="המשוב שלך"
            rows={4}
            required
            />
            </div>
          <Button
            type="submit"
            className="flex items-center justify-center gap-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting? (
              <LoaderCircleIcon className="w-5 h-5 animate-spin" />
            ): (
              <Send className="w-5 h-5" />
            )}
            <span>שלח משוב</span>
          </Button>
        </form>
      )}
    </>
  );
}