// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className="border-t border-t-gray-200 py-8">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="mb-4 md:mb-0">
//             <h2 className="text-xl font-bold">Talent Bridge</h2>
//             <p className="text-sm">© 2026 Your Company. All rights reserved.</p>
//           </div>

//           <div className="flex space-x-4 mt-4 md:mt-0">
//             <a href="https://facebook.com" className="hover:text-gray-400" aria-label="Facebook">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg>
//             </a>
//             <a href="https://twitter.com" className="hover:text-gray-400" aria-label="Twitter">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" /></svg>
//             </a>
//             <a href="https://linkedin.com" className="hover:text-gray-400" aria-label="LinkedIn">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" /></svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import React from "react";
import { Mail, ArrowRight } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold">
              Talent<span className="text-[#F97316]">Bridge</span>
            </h2>

            <p className="text-gray-400 mt-4 max-w-md leading-7">
              Connecting talented people with the right opportunities. Discover
              jobs, build your career and take the next step towards your dream
              future.
            </p>

            {/* Newsletter */}
            <div className="mt-7">
              <p className="text-sm font-semibold mb-3">
                Get the latest job opportunities
              </p>

              <div className="flex max-w-md bg-white/10 border border-white/10 rounded-full p-1">
                <div className="flex items-center gap-2 px-4 flex-1">
                  <Mail className="w-4 h-4 text-gray-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                  />
                </div>

                <button className="bg-[#F97316] hover:bg-[#EA580C] transition px-5 py-2 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="font-semibold text-lg mb-5">For Job Seekers</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/jobs" className="hover:text-[#F97316] transition">
                  Browse Jobs
                </a>
              </li>

              <li>
                <a
                  href="/companies"
                  className="hover:text-[#F97316] transition"
                >
                  Explore Companies
                </a>
              </li>

              <li>
                <a
                  href="/saved-jobs"
                  className="hover:text-[#F97316] transition"
                >
                  Saved Jobs
                </a>
              </li>

              <li>
                <a href="/profile" className="hover:text-[#F97316] transition">
                  My Profile
                </a>
              </li>

              <li>
                <a
                  href="/applications"
                  className="hover:text-[#F97316] transition"
                >
                  My Applications
                </a>
              </li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h3 className="font-semibold text-lg mb-5">For Recruiters</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/post-job" className="hover:text-[#F97316] transition">
                  Post a Job
                </a>
              </li>

              <li>
                <a
                  href="/candidates"
                  className="hover:text-[#F97316] transition"
                >
                  Find Candidates
                </a>
              </li>

              <li>
                <a
                  href="/dashboard"
                  className="hover:text-[#F97316] transition"
                >
                  Recruiter Dashboard
                </a>
              </li>

              <li>
                <a href="/pricing" className="hover:text-[#F97316] transition">
                  Pricing
                </a>
              </li>

              <li>
                <a
                  href="/resources"
                  className="hover:text-[#F97316] transition"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-5">Company</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/about" className="hover:text-[#F97316] transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-[#F97316] transition">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="/help" className="hover:text-[#F97316] transition">
                  Help Center
                </a>
              </li>

              <li>
                <a href="/privacy" className="hover:text-[#F97316] transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="/terms" className="hover:text-[#F97316] transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © 2026{" "}
              <span className="text-gray-300 font-medium">TalentBridge</span>.
              All rights reserved.
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#F97316] hover:text-white transition"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#F97316] hover:text-white transition"
              >
                <FaTwitter className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#F97316] hover:text-white transition"
              >
                <FaInstagram className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#F97316] hover:text-white transition"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>

            {/* Bottom Text */}
            <div className="text-sm text-gray-500">
              Made with ❤️ for job seekers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
