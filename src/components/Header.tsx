import React, { useState } from "react";
import { Menu, User, LogOut, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TicketPanel from "./ticket/TicketPanel";
import logo from "../assets/robot.jpeg";
import { useChat } from "../context/ChatContext";  
interface HeaderProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const [showTicketModal, setShowTicketModal] = useState(false);
 
  const { initialTicketDescription } = useChat();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleProfile = () => {
    console.log("Profile clicked");
  };

  const toggleTicketModal = () => {
    setShowTicketModal((prev) => !prev);
  };

  return (
    <>
      <header className="bg-[#001f3f] text-white shadow-md z-10 sticky top-0 mb-4">
        <div className="mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="mr-3 h-20 w-20">
                <img
                  src={logo}
                  alt="AMS Genie Logo"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-wider text-[#f4d06f]">
                AMS GENIE <br />
                <span className="text-white italic font-normal text-sm">
                  Stay lit .. Stay smart
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTicketModal}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center"
            >
              <Ticket size={18} className="mr-2" />
              <span className="hidden sm:inline">Ticket</span>
            </button>

            <button
              onClick={handleProfile}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center"
            >
              <User size={18} className="mr-2" />
              <span className="hidden sm:inline">Babu</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
          <div className="rounded-lg w-[80%]   h-[90%]  max-w-7xl relative">
            <button
              onClick={toggleTicketModal}
              className="absolute top-2 right-6 text-white text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
         <TicketPanel 
              initialShortDescription={initialTicketDescription || ""}
              initialLongDescription={initialTicketDescription || ""}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;