import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 5000);
      }, 1500);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#3C2415] to-[#5D3A1A] py-16 px-4 sm:px-6 lg:px-8 rounded-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(210, 105, 30, 0.3) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#D2691E] px-4 py-2 rounded-full mb-4">
            <Coffee className="h-5 w-5 text-white" />
            <span 
              className="text-white text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Weekly Coffee Breaks
            </span>
          </div>

          <h2 
            className="text-3xl md:text-4xl text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Get Fresh Reads in Your Inbox
          </h2>
          
          <p 
            className="text-lg text-white/80 max-w-2xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Join our community of thoughtful readers. Receive curated articles on lifestyle, 
            productivity, and growth every Sunday morning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 h-12 backdrop-blur-sm focus:bg-white/20 focus:border-[#D2691E]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#D2691E] hover:bg-[#B8581A] text-white h-12 px-8 disabled:opacity-50"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Mail className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 
                className="text-xl text-white mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Welcome to the Coffee'n me family!
              </h3>
              <p 
                className="text-white/80"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                Check your inbox for a confirmation email.
              </p>
            </motion.div>
          )}

          <p 
            className="text-sm text-white/60 text-center mt-4"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            No spam, ever. Unsubscribe anytime with one click.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
