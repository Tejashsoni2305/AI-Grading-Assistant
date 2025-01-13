import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base">
          Grading Application © {new Date().getFullYear()}
        </p>
        <p className="mt-2 text-sm md:text-base">
          Visit us:{" "}
          <a
            href="https://example.com"
            className="text-blue-400 hover:text-blue-300 transition duration-200"
          >
            Our Website
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
