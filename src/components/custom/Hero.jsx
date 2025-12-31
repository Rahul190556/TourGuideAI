import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import placeImage from "../../assets/tripplan.png";

function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100 overflow-hidden">
      
      {/* Decorative blur */}
      <div className="absolute -top-20 -left-20 h-72 w-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 bg-pink-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT CONTENT */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-gray-900">
            Plan Your Next Adventure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              with AI in Minutes ✈️
            </span>
          </h1>

          <p className="mt-6 text-gray-700 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
            Discover trips tailored to your budget, interests, and travel style.
            From hidden gems to iconic destinations — your perfect itinerary is just one click away.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/create-trip">
              <Button className="px-8 py-4 rounded-full text-lg font-semibold bg-black text-white hover:bg-gray-900 transition">
                Plan My Trip 🎒
              </Button>
            </Link>

            <Link to="/my-trips">
              <Button
                variant="outline"
                className="px-8 py-4 rounded-full text-lg font-semibold"
              >
                View My Trips
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            🚀 Trusted by travelers to build smarter journeys
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 w-full flex justify-center">
          <div className="relative group">
            <img
              src={placeImage}
              alt="AI Trip Planner"
              className="w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-3xl bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
