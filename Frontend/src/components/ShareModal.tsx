import { motion, AnimatePresence } from 'motion/react';
import { X, Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export function ShareModal({ isOpen, onClose, title, url = window.location.href }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#FFFEF9] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-[#E8D5B7]">
            <div className="flex items-center justify-between">
              <h3 
                className="text-xl text-[#3C2415]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Share Article
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5E6D3] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#8B4513]" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Social Share Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <motion.a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 bg-[#F5E6D3] hover:bg-[#E8D5B7] rounded-xl transition-colors"
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <span 
                  className="text-sm text-[#3C2415]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Twitter
                </span>
              </motion.a>

              <motion.a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 bg-[#F5E6D3] hover:bg-[#E8D5B7] rounded-xl transition-colors"
              >
                <Facebook className="h-6 w-6 text-[#1877F2]" />
                <span 
                  className="text-sm text-[#3C2415]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Facebook
                </span>
              </motion.a>

              <motion.a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 bg-[#F5E6D3] hover:bg-[#E8D5B7] rounded-xl transition-colors"
              >
                <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                <span 
                  className="text-sm text-[#3C2415]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  LinkedIn
                </span>
              </motion.a>
            </div>

            {/* Copy Link */}
            <div className="pt-4 border-t border-[#E8D5B7]">
              <p 
                className="text-sm text-[#8B4513] mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Or copy link
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-4 py-2 bg-[#FAF7F2] border border-[#E8D5B7] rounded-lg text-sm text-[#3C2415] outline-none"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-[#D2691E] hover:bg-[#B8581A] text-white'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Link2 className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
