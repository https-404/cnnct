import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
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
      <nav className={`flex items-center justify-between px-6 py-3 border-b bg-white ${className}`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">ChatApp</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Avatar 
            src={user?.avatar || undefined} 
            alt={user?.username || "User"} 
            className="w-8 h-8 cursor-pointer" 
          />
          <Button variant="ghost" onClick={() => setShowEditModal(true)}>
            Edit Profile
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
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
