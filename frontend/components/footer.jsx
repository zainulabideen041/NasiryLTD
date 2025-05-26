import { Facebook, Instagram, Youtube, Globe } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 z-1000 w-full border-t-1 bg-white py-2 md:py-3 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div></div>
        <p className="text-sm md:text-md text-center sm:text-left">
          © {new Date().getFullYear()} Designed & Developed by{" "}
          <Link
            href="https://syndevx.vercel.app"
            className="font-extrabold tracking-wide hover:underline transition"
          >
            SynDevX
          </Link>
        </p>
        <div className="flex space-x-4">
          <a
            href="https://syndevx.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <Globe size={20} />
          </a>
          <a
            href="https://instagram.com/syndevx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            <Youtube size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
