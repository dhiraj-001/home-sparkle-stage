import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string | null;
  profile_image: string | null;
  profile_image_full_path: string | null;
  is_phone_verified: number;
  is_email_verified: number;
  wallet_balance: number;
  loyalty_point: number;
  ref_code: string | null;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("demand_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://admin.sarvoclub.com/api/v1/customer/info", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response_code === "default_200" && data.content) {
            setUser(data.content);
          } else {
            throw new Error("Invalid API response");
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem("demand_token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("demand_token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("demand_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://admin.sarvoclub.com/api/v1/customer/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem("demand_token");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user.profile_image_full_path || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border shadow"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.phone}</p>
          </div>
        </div>

        {/* Extra Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Phone Verified</p>
            <p className={`font-bold ${user.is_phone_verified ? "text-green-600" : "text-red-600"}`}>
              {user.is_phone_verified ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Email Verified</p>
            <p className={`font-bold ${user.is_email_verified ? "text-green-600" : "text-red-600"}`}>
              {user.is_email_verified ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <p className="font-bold text-blue-600">₹{user.wallet_balance}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Loyalty Points</p>
            <p className="font-bold text-blue-600">{user.loyalty_point}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
