import { useEffect, useState, useRef } from "react";
import apiHelper from "../helper/ApiHelper";
import toast from "react-hot-toast";

const ChangeUsername = ({ onUpdate }) => {
  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!username) {
      setAvailable(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      apiHelper.get(`/user/check-username/${username}`)
        .then(res => setAvailable(res.condition))
        .catch(() => setAvailable(false));
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [username]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("streamhaven-token");
    const payload = { username };

    toast.promise(
      apiHelper.postAuthorization("/user/change-username", payload, token),
      {
        loading: "Updating username...",
        success: (res) => {
          onUpdate?.(res.username);
          return res.message;
        },
        error: "Failed to update username",
      }
    );
  };

  return (
    <div className="mt-4 text-left max-w-[25rem] mx-auto">
      <label className="block mb-1 font-medium">Change Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
        placeholder="Enter new username"
        className="w-full p-2 rounded bg-gray-100 text-black focus:outline-none focus:ring focus:ring-primary-color-and-hover"
      />
      <div className="mt-1 text-sm">
        {available === true && <span className="text-green-500">✅ Username available</span>}
        {available === false && <span className="text-red-500">❌ Username taken</span>}
      </div>
      <button
        disabled={!available}
        onClick={handleSubmit}
        className={`mt-3 w-full py-2 rounded text-white transition 
          ${available ? "bg-primary-color-and-hover hover:opacity-90" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Update Username
      </button>
    </div>
  );
};

export default ChangeUsername;
