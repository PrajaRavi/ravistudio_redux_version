import { motion } from "framer-motion";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";

const footerData = {
  Company: ["About", "Jobs", "For the Record"],
  Communities: ["For Artists", "Developers", "Advertising", "Investors", "Vendors"],
  "Useful Links": ["Support", "Free Mobile App", "Popular by Country", "Import your music"],
  "Spotify Plans": [
    "Premium Lite",
    "Premium",
    "Standard",
    "Platinum",
    "Premium Student",
    "Spotify Free",
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full mt-20 text-gray-300">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-t border-white/10" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {Object.entries(footerData).map(([title, links]) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li
                    key={link}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-4 lg:justify-end col-span-2 sm:col-span-1"
          >
            <SocialIcon
              Icon={FaInstagram}
              hoverColor="hover:bg-pink-500"
              glow="hover:shadow-pink-500/50"
            />
            <SocialIcon
              Icon={FaTwitter}
              hoverColor="hover:bg-sky-500"
              glow="hover:shadow-sky-500/50"
            />
            <SocialIcon
              Icon={FaFacebookF}
              hoverColor="hover:bg-blue-600"
              glow="hover:shadow-blue-600/50"
            />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between text-xs text-gray-400">
          <div className="flex flex-wrap gap-4">
            {[
              "Legal",
              "Safety & Privacy Center",
              "Privacy Policy",
              "Cookies",
              "About Ads",
              "Accessibility",
            ].map((item) => (
              <span
                key={item}
                className="hover:text-white cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>

          <span>© 2026 Spotify AB</span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ Icon, hoverColor, glow }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.15,
        rotateX: 10,
        rotateY: -10,
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        w-10 h-10 flex items-center justify-center rounded-full
        bg-white/10 backdrop-blur-md
        shadow-lg shadow-black/40
        cursor-pointer
        ${hoverColor}
        ${glow}
        hover:shadow-xl
        transition-all
      `}
    >
      <Icon className="text-white text-lg" />
    </motion.div>
  );
}
