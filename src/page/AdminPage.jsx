import { useEffect, useRef, useState } from "react";
import apiHelper from "../helper/ApiHelper";
import Dialog from "../component/Dialog";
import toast from "react-hot-toast";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const debounceTimer = useRef(null);
  const token = localStorage.getItem("streamhaven-token");

  const fetchUsers = () => {
    apiHelper.getAuthorization("/admin/users", token)
      .then((res) => {
        setUsers(res.users);
        setFiltered(res.users);
      })
      .catch(() => toast.error("Failed to fetch users"));
  };

  const promoteUser = (userId) => {
    apiHelper.putAuthorization("/admin/promote-user", { userId }, token)
      .then(() => {
        toast.success("User promoted");
        fetchUsers();
      })
      .catch(() => toast.error("Failed to promote user"));
  };

  const updateField = () => {
    const isUsername = dialogType === "username";
    const url = isUsername
      ? `/admin/user/${activeUser._id}/change-username`
      : `/admin/reset-password`;

    const payload = isUsername
      ? { newUsername: inputValue }
      : { userId: activeUser._id, newPassword: inputValue };

    toast.promise(
      apiHelper.postAuthorization(url, payload, token),
      {
        loading: "Updating...",
        success: "Updated successfully",
        error: "Update failed"
      }
    ).then(() => {
      fetchUsers();
      closeDialog();
    });
  };

  const closeDialog = () => {
    setDialogType(null);
    setActiveUser(null);
    setInputValue("");
    setIsAvailable(null);
  };

  const refetchGenres = () => {
    toast.promise(apiHelper.getAuthorization("/sync/genres", token), {
      loading: "Syncing genres...",
      success: "Genres synced",
      error: "Failed to sync genres"
    });
  };

  const refetchTrending = () => {
    toast.promise(apiHelper.getAuthorization("/sync/trending", token), {
      loading: "Syncing trending...",
      success: "Trending synced",
      error: "Failed to sync trending"
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFiltered(users.filter(u =>
      u.email.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, users]);

  useEffect(() => {
    if (dialogType !== "username" || inputValue.trim().length < 3) {
      setIsAvailable(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      apiHelper.get(`/user/check-username/${encodeURIComponent(inputValue)}`)
        .then(res => setIsAvailable(res.condition))
        .catch(() => setIsAvailable(false));
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue, dialogType]);

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-primary">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <button
          onClick={refetchGenres}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm"
        >
          Sync Genres
        </button>
        <button
          onClick={refetchTrending}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm"
        >
          Sync Trending
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email"
          className="flex-1 px-3 py-2 text-black rounded border focus:outline-none focus:ring focus:ring-indigo-400"
        />
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm bg-gray-800 rounded overflow-hidden">
          <thead className="bg-gray-700 text-left">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  {u.role !== "Admin" && (
                    <button
                      onClick={() => promoteUser(u._id)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      Promote
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDialogType("username");
                      setActiveUser(u);
                      setInputValue(u.username);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs"
                  >
                    Change Username
                  </button>
                  <button
                    onClick={() => {
                      setDialogType("password");
                      setActiveUser(u);
                      setInputValue("");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                  >
                    Change Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeUser && dialogType && (
        <Dialog
          useTitle
          useClose
          title={`Change ${dialogType}`}
          closeFunction={closeDialog}
        >
          <input
            type={dialogType === "password" ? "password" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full mt-4 p-2 rounded text-black border focus:outline-none focus:ring"
            placeholder={`New ${dialogType}`}
          />

          {dialogType === "username" && inputValue && (
            <p className="text-sm mt-2">
              {isAvailable === true ? (
                <span className="text-green-500">✅ Username available</span>
              ) : isAvailable === false ? (
                <span className="text-red-500">❌ Username taken</span>
              ) : (
                <span className="text-gray-400">Checking...</span>
              )}
            </p>
          )}

          <button
            onClick={updateField}
            className="mt-4 w-full bg-primary-color-and-hover hover:bg-primary-color-hover text-white py-2 rounded"
            disabled={dialogType === "username" && isAvailable === false}
          >
            Submit
          </button>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPage;
