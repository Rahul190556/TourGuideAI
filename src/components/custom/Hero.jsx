import { Button } from "../ui/Button";
import { Link } from 'react-router-dom';
import placeImage from '../../assets/tripplan.png';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black gap-9 p-6">
      <br />
      <br />

      <h1 className="font-extrabold text-4xl lg:text-5xl text-center mt-[-12rem] text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text animate__animated animate__fadeIn animate__delay-1s">
        🌐 Ready for Your Next Adventure? ✈️
        <br />
        Let AI Build Your Dream Vacation in Minutes!
      </h1>
      <p className="text-sm lg:text-lg text-center max-w-3xl mt-4 font-medium text-gray-800 opacity-90 transition-opacity duration-700 hover:opacity-100">
        Imagine exploring new places that match your interests, style, and budget. Whether you're after hidden gems or classic hotspots, AI will whip up a trip just for you! Ready to discover your next escape? Let's make it happen! 😎
      </p>
      <Link to={'/create-trip'}>
        <Button className="bg-yellow-500 text-black py-3 px-6 rounded-full text-lg font-semibold mt-6 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:text-yellow-500">
          Yes! Plan My Perfect Trip 🎒
        </Button>
      </Link>
      <div className="relative">
        <img 
          src={placeImage} 
          className="h-[420px] -mb-[100px] rounded-xl shadow-2xl transition-all duration-500 hover:scale-110 hover:opacity-80" 
          alt="Trip Plan"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25 rounded-xl transition-all duration-500 opacity-0 hover:opacity-50"></div>
      </div>
    </div>
  );
}

export default Hero;
