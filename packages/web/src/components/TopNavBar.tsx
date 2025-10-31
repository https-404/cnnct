import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "./ui/Avatar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Logo } from "./ui/Logo";
import { selectAuthUser, setCredentials } from "../feature/auth/auth.slice";
import { RootState } from "../store";
import { userService } from "../services/api/user.service";
import { authService } from "../services/api/auth.service";
import { clearTokens } from "../services/token";
import { useNavigate } from "react-router-dom";
import { EditProfileModal } from "./EditProfileModal";

interface TopNavBarProps {
  className?: string;
}

export function TopNavBar({ className = "" }: TopNavBarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectAuthUser(state));
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        dispatch(setCredentials({
          user: currentUser,
          accessToken: user?.accessToken || null,
          refreshToken: user?.refreshToken || null,
        }));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      if (user?.refreshToken) {
        await authService.logout(user.refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      dispatch(setCredentials({ user: null, accessToken: null, refreshToken: null }));
      navigate("/auth/SignInPage");
    }
  };

  const handleProfileUpdate = async (updatedUser: any) => {
    dispatch(setCredentials({
      user: updatedUser,
      accessToken: user?.accessToken || null,
      refreshToken: user?.refreshToken || null,
    }));
  };

  return (
    <>
      <nav className={`flex items-center justify-between px-4 py-2.5 border-b border-[#e9edef] bg-[#00a884] ${className}`}>
        <div className="flex items-center gap-3">
          <Logo showText={true} size="md" variant="white" />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setShowEditModal(true)}
            className="text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
            title="Edit Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <Avatar 
            src={user?.avatar || undefined} 
            alt={user?.username || "User"} 
            className="w-8 h-8 cursor-pointer ring-2 ring-white/30" 
          />
          <button 
            onClick={handleLogout}
            className="text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
