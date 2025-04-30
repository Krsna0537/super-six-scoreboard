import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-cricket-darkblue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
          
          {/* Team Section */}
          <div className="bg-white/10 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-lg">Prasanna Mesta</p>
                <p className="text-sm text-gray-300">1VE23CY037</p>
              </div>
              <div>
                <p className="font-semibold text-lg">Niranjan S</p>
                <p className="text-sm text-gray-300">1VE23CY033</p>
              </div>
              <div>
                <p className="font-semibold text-lg">Niranjan S</p>
                <p className="text-sm text-gray-300">1VE23CY034</p>
              </div>
              <div>
                <p className="font-semibold text-lg">Gurudeep M R</p>
                <p className="text-sm text-gray-300">1VE23CY018</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* GitHub Section */}
            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">GitHub Repository</h3>
              <a 
                href="https://github.com/Krsna0537/super-six-scoreboard.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cricket-gold hover:text-cricket-gold/80 transition"
              >
                View on GitHub
              </a>
            </div>

            {/* Email Section */}
            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Email Us</h3>
              <a 
                href="mailto:pmesta246@gmail.com" 
                className="text-cricket-gold hover:text-cricket-gold/80 transition"
              >
                pmesta246@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 