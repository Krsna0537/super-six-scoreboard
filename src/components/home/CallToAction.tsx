import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 bg-cricket-darkblue text-white">
      <div className="cricket-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="cricket-heading-2 mb-4">Ready to Transform Your Cricket Management?</h2>
          <p className="text-lg mb-8">
            Join thousands of cricket clubs and tournaments worldwide using Cric 18 to manage their games effectively.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link to="/register" className="px-6 py-3 bg-white text-cricket-darkblue font-semibold rounded-md hover:bg-gray-100 transition">
              Create Free Account
            </Link>
            <Link to="/contact" className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white/10 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
