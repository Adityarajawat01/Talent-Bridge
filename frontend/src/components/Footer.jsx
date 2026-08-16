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
