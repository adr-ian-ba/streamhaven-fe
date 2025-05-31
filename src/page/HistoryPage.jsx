import { useContext, useEffect, useState } from "react";
import { UserContext } from "../helper/UserContext";
import apiHelper from "../helper/ApiHelper";
import toast from "react-hot-toast";
import Navigation from "../component/Navigation";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";

const getLocalHistory = () => {
  const raw = JSON.parse(localStorage.getItem("local-save") || "[]");
  const history = raw.find(f => f.folder_name === "History");
  const now = Date.now();

  return history?.saved
    ?.filter(item => now - new Date(item.watchedAt).getTime() <= 7 * 24 * 60 * 60 * 1000)
    .slice(0, 50) || [];
};

const clearLocalHistory = () => {
  const raw = JSON.parse(localStorage.getItem("local-save") || "[]");
  const updated = raw.filter(f => f.folder_name !== "History");
  localStorage.setItem("local-save", JSON.stringify(updated));
  window.dispatchEvent(new Event("localStorageUpdated"));
};

const HistoryPage = () => {
  const { isLoggedIn } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchHistory = () => {
    if (!isLoggedIn) {
      setHistory(getLocalHistory());
      return;
    }

    const token = localStorage.getItem("streamhaven-token");
    apiHelper
      .getAuthorization("/user/gethistory", token)
      .then((res) => {
        if (res.condition) {
          setHistory(res.result);
        } else {
          toast.error(res.message || "Failed to fetch history");
        }
      })
      .catch(() => toast.error("Failed to load history"));
  };

  const handleDeleteOne = (movieId) => {
    if (!isLoggedIn) {
      const updated = history.filter(m => m.id !== movieId);
      setHistory(updated);
      localStorage.setItem("local-save", JSON.stringify([{
        folder_name: "History",
        saved: updated
      }]));
      return;
    }

    const token = localStorage.getItem("streamhaven-token");
    apiHelper
      .postAuthorization("/user/deletehistory", { movieId }, token)
      .then((res) => {
        if (res.condition) {
          toast.success("History item removed");
          fetchHistory();
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => toast.error("Failed to remove movie"));
  };

  const handleClearAll = () => {
    if (!isLoggedIn) {
      clearLocalHistory();
      setHistory([]);
      return;
    }

    const token = localStorage.getItem("streamhaven-token");
    apiHelper
      .postAuthorization("/user/clearhistory", {}, token)
      .then((res) => {
        if (res.condition) {
          toast.success("History cleared");
          setHistory([]);
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => toast.error("Failed to clear history"));
  };

  useEffect(() => {
    fetchHistory();
  }, [isLoggedIn]);

  const goBack = () => navigate(-1);

  return (
    <div className="background-color">
      <div className="background-color min-h-[100vh] text-white">
        <Navigation />
        <div className="pt-26 mx-4 2xl:mx-[8rem]">
          <div onClick={goBack} className="flex items-center gap-2 p-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <h1>BACK</h1>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[2.5rem] font-bold">Watch History</h1>
            {history.length > 0 && (
              <button onClick={handleClearAll} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-[3px]">
                Clear All
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-black text-white border border-gray-700 rounded-lg">
                <thead className="bg-primary-color text-left">
                  <tr>
                    <th className="p-3">Poster</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Watched</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((movie) => (
                    <tr key={movie.id} className="border-t border-gray-700 hover:bg-white/5 transition">
                      <td className="p-3">
                        <img src={movie.poster_path} alt={movie.title} className="w-12 rounded" />
                      </td>
                      <td className="p-3">{movie.title}</td>
                      <td className="p-3">{movie.media_type}</td>
                      <td className="p-3 text-sm">{new Date(movie.watchedAt).toLocaleString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteOne(movie.id)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white">No history found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HistoryPage;
