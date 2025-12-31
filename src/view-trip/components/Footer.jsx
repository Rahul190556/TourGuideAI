function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-600">

          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Tour Guide Planner
            </h2>
            <p className="leading-relaxed">
              Plan smarter trips with AI-powered itineraries.
              Discover destinations, manage budgets, and travel stress-free.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2">
              <li className="hover:text-black cursor-pointer">Create Trip</li>
              <li className="hover:text-black cursor-pointer">My Trips</li>
              <li className="hover:text-black cursor-pointer">AI Planner</li>
              <li className="hover:text-black cursor-pointer">Destinations</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li className="hover:text-black cursor-pointer">About Us</li>
              <li className="hover:text-black cursor-pointer">Careers</li>
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Terms of Service</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li className="hover:text-black cursor-pointer">Help Center</li>
              <li className="hover:text-black cursor-pointer">Contact Us</li>
              <li className="hover:text-black cursor-pointer">FAQs</li>
              <li className="hover:text-black cursor-pointer">Feedback</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>
            © 2026 <span className="font-medium text-gray-700">Tour Guide Planner</span>. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Made with ❤️ for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
