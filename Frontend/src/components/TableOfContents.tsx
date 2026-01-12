import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { List, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  content: string[];
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Generate sections from first sentence of each paragraph
  const sections = content.map((paragraph, index) => {
    const firstSentence = paragraph.split('.')[0];
    return {
      id: index,
      title: firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence
    };
  });

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`paragraph-${index}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(index);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24 h-fit">
        <div className="bg-[#FFFEF9] rounded-xl p-6 shadow-md border border-[#E8D5B7]">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E8D5B7]">
            <List className="h-5 w-5 text-[#D2691E]" />
            <h3
              className="text-[#3C2415]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Table of Contents
            </h3>
          </div>

          <nav className="space-y-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(index)}
                whileHover={{ x: 4 }}
                className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${activeSection === index
                    ? 'bg-[#F5E6D3] text-[#D2691E]'
                    : 'text-[#8B4513] hover:bg-[#FAF7F2]'
                  }`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                <span className="line-clamp-2">{section.title}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-24 right-8 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#D2691E] hover:bg-[#B8581A] text-white p-4 rounded-full shadow-lg"
          aria-label="Table of contents"
        >
          <List className="h-6 w-6" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-72 bg-[#FFFEF9] rounded-xl shadow-2xl border border-[#E8D5B7] p-4 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E8D5B7]">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-[#D2691E]" />
                  <h3
                    className="text-sm text-[#3C2415]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Jump to Section
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#8B4513] hover:text-[#D2691E]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(index)}
                    className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${activeSection === index
                        ? 'bg-[#F5E6D3] text-[#D2691E]'
                        : 'text-[#8B4513] hover:bg-[#FAF7F2]'
                      }`}
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    <span className="line-clamp-2">{section.title}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
