import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import travelPlannerLogo from "../../assets/travelplanner.png";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { Menu, X } from "lucide-react";

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => getUserProfile(tokenInfo),
    onError: (err) => console.error(err),
  });

  const getUserProfile = async (tokenInfo) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    setMobileOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={travelPlannerLogo} alt="logo" className="h-9 w-9 rounded-lg" />
            <span className="font-semibold text-lg">TravelPlanner</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/">
              <Button variant="ghost" className="rounded-full px-4">
                Home
              </Button>
            </a>

            {user ? (
              <>
                <a href="/create-trip">
                  <Button className="rounded-full px-5 bg-black text-white">
                    + Create Trip
                  </Button>
                </a>

                <a href="/my-trips">
                  <Button variant="outline" className="rounded-full px-5">
                    My Trips
                  </Button>
                </a>

                <Popover>
                  <PopoverTrigger>
                    <img
                      src={user.picture}
                      alt="avatar"
                      className="h-9 w-9 rounded-full ring-2 ring-gray-300 hover:ring-black"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <p className="text-sm font-medium mb-2 truncate">{user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <button
                onClick={() => setOpenDialog(true)}
                className="rounded-full px-5 py-2 bg-black text-white"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-5 py-6 space-y-4">
            <a href="/" className="block text-lg font-medium">Home</a>

            {user ? (
              <>
                <a href="/create-trip" className="block text-lg font-medium">
                  Create Trip
                </a>
                <a href="/my-trips" className="block text-lg font-medium">
                  My Trips
                </a>
                <button
                  onClick={handleLogout}
                  className="block text-left text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpenDialog(true);
                  setMobileOpen(false);
                }}
                className="w-full text-left font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* SIGN IN DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogDescription className="text-center">
              <img src={travelPlannerLogo} className="w-16 h-16 mx-auto mb-4 rounded-xl" />
              <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
              <p className="text-gray-500 mb-6">
                Sign in securely with Google to plan your trips.
              </p>

              <button
                disabled={loading}
                onClick={login}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-black text-white"
              >
                <FcGoogle className="h-6 w-6" />
                {loading ? "Signing in..." : "Continue with Google"}
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;
