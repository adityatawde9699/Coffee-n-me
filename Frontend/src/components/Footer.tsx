import { Coffee, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#F5E6D3] border-t border-[#E8D5B7] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Coffee className="h-6 w-6 text-[#D2691E]" />
            <span 
              className="text-xl font-semibold text-[#3C2415]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Coffee'n me
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8 mb-6 md:mb-0">
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              About
            </a>
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Contact
            </a>
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Privacy
            </a>
          </nav>

          {/* Social Media */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-[#8B4513] hover:text-[#D2691E] transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E8D5B7] text-center">
          <p 
            className="text-[#8B4513] text-sm"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            © 2024 Coffee'n me. All rights reserved. Thoughtful reads for your coffee breaks.
          </p>
        </div>
      </div>
    </footer>
  );
}