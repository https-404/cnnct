import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Avatar } from "./ui/Avatar";
import { userService } from "../services/api/user.service";
import { User } from "../types/user.type";

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [currentUser, setCurrentUser] = useState(user); // Track current user state for avatar display
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when user prop changes
  useEffect(() => {
    setCurrentUser(user);
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await userService.updateProfile({
        username,
        email,
        phoneNumber: phoneNumber || undefined,
      });
      onUpdate(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from closing
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent modal from closing
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const updatedUser = await userService.uploadProfilePicture(file);
      setCurrentUser(updatedUser); // Update local state immediately for preview
      onUpdate(updatedUser);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm" onClick={(e) => e.stopPropagation()}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6" onClick={(e) => e.stopPropagation()}>
            <div className="relative cursor-pointer" onClick={handleAvatarClick}>
              <Avatar
                src={currentUser.avatar || undefined}
                alt={username}
                className="w-24 h-24 border-4 border-gray-200"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-[#00a884] text-white rounded-full p-2 shadow-lg hover:bg-[#008069] transition-colors pointer-events-none">
                <CameraIcon className="w-4 h-4" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              onClick={(e) => e.stopPropagation()}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
          </div>

          {/* Username */}
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              required
              className="w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="w-full"
              placeholder="Optional"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-[#00a884] hover:bg-[#008069]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

