import { useContext, useEffect, useState } from "react";
import { getMovieFromLocal } from "../helper/SaveHelper";
import MovieGrid from "../component/MovieGrid";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import Navigation from "../component/Navigation";
import { UserContext } from "../helper/UserContext";
import apiHelper from "../helper/ApiHelper";
import toast from "react-hot-toast";
import Dialog from "../component/Dialog";

const SavePage = () => {
  const [liked, setLiked] = useState(null);
  const [later, setLater] = useState(null);
  const [cloudFolders, setCloudFolders] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
const [newFolderName, setNewFolderName] = useState("");

  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const updateMovies = () => {
    const getOne = getMovieFromLocal("liked") || [];
    const getTwo = getMovieFromLocal("Watchlater") || [];

    setLiked(getOne);
    setLater(getTwo);
  };
  const handleDeleteFolder = (folderId) => {
  const token = localStorage.getItem("streamhaven-token");
  if (!token) return;

  toast.promise(
    apiHelper.postAuthorization("/user/deletefolder", { folderId }, token),
    {
      loading: "Deleting folder...",
      success: "Folder deleted successfully.",
      error: "Failed to delete folder."
    }
  ).then(fetchCloudFolders);
};


  useEffect(() => {
    updateMovies();

    const handleStorageChange = (event) => {
      if (event.key === "local-save") {
        updateMovies();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleCustomEvent = () => updateMovies();
    window.addEventListener("localStorageUpdated", handleCustomEvent);
    return () => window.removeEventListener("localStorageUpdated", handleCustomEvent);
  }, []);

  const fetchCloudFolders = () => {
  const token = localStorage.getItem("streamhaven-token");
  if (!token) return;

  apiHelper
    .getAuthorization("/user/getsavedmovie", token)
    .then((result) => {
      if (!result.condition) {
        toast.error(result.message || "Failed to fetch saved movies");
        return;
      }
      console.log(result)
      setCloudFolders(result.folders || []);
    })
    .catch((err) => {
      console.error("Fetch saved movies error:", err);
      toast.error("Failed to load your cloud folders.");
    });
};
const handleAddFolder = () => {
  const token = localStorage.getItem("streamhaven-token");
  const trimmed = newFolderName.trim();

  if (!trimmed) return toast.error("Folder name cannot be empty");
  if (/\s/.test(trimmed)) return toast.error("Folder name must not contain spaces.");
  if (trimmed.length > 10) return toast.error("Folder name must be at most 10 characters.");

  toast.promise(
    apiHelper.postAuthorization("/user/addfolder", { folder_name: trimmed }, token),
    {
      loading: "Creating folder...",
      success: (res) => {
        if (!res.condition) throw new Error(res.message);
        return res.message;
      },
      error: (err) => err?.message || "Failed to create folder"
    }
  ).then(() => {
    fetchCloudFolders();
    setShowCreateDialog(false);
    setNewFolderName("");
  });
};




useEffect(() => {
  if (isLoggedIn) fetchCloudFolders();
}, [isLoggedIn]);

  const goBack = () => navigate(-1);

  if ((!liked || !later) && !isLoggedIn) {
    return <p className="text-center pt-10">Loading...</p>;
  }

  return (
    <div className="background-color">
      <Navigation />
      <div className="relative min-h-[100dvh] mx-4 2xl:mx-[8rem] pt-[5rem]">
        <div onClick={goBack} className="flex items-center gap-2 p-1 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <h1>BACK</h1>
        </div>

        <h1 className="text-[2.5rem] font-bold mb-[.5rem]">Saved Movies</h1>

        {isLoggedIn ? (
          <div>
            {cloudFolders?.length > 0 ? (
              cloudFolders.map((eachFolder, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-[2rem] font-bold mb-[.5rem]">{eachFolder.folder_name}</h1>
                    <button
                      onClick={() => handleDeleteFolder(eachFolder._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm text-white"
                    >
                      Delete Folder
                    </button>
                  </div>

                  {eachFolder.saved?.length > 0 ? (
                    <MovieGrid
                      renderType="cloud"
                      folderId={eachFolder._id}
                      folderName={eachFolder.folder_name}
                      movies={eachFolder.saved}
                      onCloudUpdate={fetchCloudFolders}
                    />
                  ) : (
                    <p className="text-gray-400 italic">This folder is empty.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No cloud-saved folders found.</p>
            )}

          </div>
        ) : (
          <div>
            {liked?.length > 0 && (
              <MovieGrid renderType="local" folderName="Liked" movies={liked}>
                <h1 className="text-[2rem] font-bold mb-[.5rem]">Liked</h1>
              </MovieGrid>
            )}
            {later?.length > 0 && (
              <MovieGrid renderType="local" folderName="Watchlater" movies={later}>
                <h1 className="text-[2rem] font-bold mb-[.5rem]">Watch Later</h1>
              </MovieGrid>
            )}
            {liked?.length === 0 && later?.length === 0 && <p>No saved movies yet.</p>}
          </div>
        )}

        {isLoggedIn && (
<div className="mt-8 text-center">
  <button
    onClick={() => setShowCreateDialog(true)}
    className="bg-primary-color-and-hover hover:bg-opacity-80 px-6 py-2 rounded text-sm font-medium w-full text-white"
  >
    + Add New Folder
  </button>
</div>

)}

      </div>

      <Footer />

      {showCreateDialog && (
  <Dialog closeFunction={() => setShowCreateDialog(false)} useTitle title="Create New Folder" useClose>
    <div className="mt-4">
      <input
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="Folder name"
        className="w-full p-2 rounded text-black"
      />
      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={() => setShowCreateDialog(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddFolder}
          className="px-4 py-2 bg-primary-color-and-hover text-white rounded"
        >
          Create
        </button>
      </div>
    </div>
  </Dialog>
)}

    </div>
  );
};

export default SavePage;
