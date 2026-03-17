'use client';

import React, { useState } from 'react';
import { Send, Mic, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseReminderText } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export const SmartInput = () => {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || isParsing) return;

    setIsParsing(true);
    try {
      const reminderData = await parseReminderText(text);
      await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        originalText: text
      });
      setText('');
    } catch (error) {
      console.error('Failed to parse or save reminder:', error);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center gap-4 bg-white/5 border border-white/10 p-2 pl-6 rounded-[2.5rem] focus-within:border-[#ff4e00]/30 transition-all shadow-2xl"
      >
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('type_reminder_placeholder') || "Remind me to buy milk tomorrow at 10am..."}
          className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 py-4"
          disabled={isParsing}
        />
        
        <div className="flex items-center gap-2 pr-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/assistant')}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#ff4e00] hover:bg-[#ff4e00]/10 transition-all"
          >
            <Mic className="w-6 h-6" />
          </motion.button>

          <motion.button
            type="submit"
            disabled={!text.trim() || isParsing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              text.trim() && !isParsing 
                ? 'bg-[#ff4e00] text-white shadow-lg shadow-[#ff4e00]/20' 
                : 'bg-white/5 text-white/20'
            }`}
          >
            {isParsing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isParsing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-6 flex items-center gap-2 text-[#ff4e00] text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t('parsing_text') || "Smarty is analyzing your request..."}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
