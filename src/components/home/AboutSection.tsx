import React from 'react';
import { Link } from 'react-router-dom';

const cricketImage = '/img1.jpg';

const AboutSection = () => (
  <section className="bg-white py-16 overflow-hidden">
    <div className="cricket-container flex flex-col lg:flex-row items-center gap-12">
      {/* Left: Extended Image */}
      <div className="flex-1 flex justify-center">
        <img
          src={cricketImage}
          alt="Cricket action"
          className="rounded-2xl shadow-lg w-full max-w-3xl h-64 md:h-80 lg:h-96 object-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>
      {/* Right: Text Content */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cricket-blue">
          Experience Cricket Like Never Before
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Cric 18 is your all-in-one platform for organizing, managing, and enjoying cricket tournaments. From real-time scoring to team management and analytics, we bring the excitement of cricket to your fingertips.
        </p>
        <ul className="text-left text-gray-600 space-y-3 mb-6 max-w-md mx-auto lg:mx-0">
          <li>• Effortless tournament scheduling and management</li>
          <li>• Live ball-by-ball scoring and match updates</li>
          <li>• Player and team profiles with rich statistics</li>
          <li>• Modern, mobile-friendly design for all users</li>
        </ul>
        <div className="mt-4">
          <Link to="/register" className="inline-block bg-cricket-blue text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-cricket-darkblue transition">
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection; 