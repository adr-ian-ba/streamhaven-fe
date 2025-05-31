/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../helper/UserContext"
import toast from "react-hot-toast"
import { checkMovie, deleteMovieFromLocal, saveMovieToLocal } from "../helper/SaveHelper"
import apiHelper from "../helper/ApiHelper"

// eslint-disable-next-line react/prop-types
const SaveOption = ({movieInfo, onCloudUpdate}) => {
    const {isLoggedIn} = useContext(UserContext)
    const [addFolder, setAddFolder] = useState(false)
    const [folders, setFolders] = useState(null)
    const [, setRefresh] = useState(false)

    const [newFolderInput, setNewFolderInput] = useState("")
    const [error, setError] = useState(false)

    const {id, poster_path, title, overview, vote_count, vote_average, release_date, media_type} = movieInfo

    const movieInfoFiltered = {
      id,
      poster_path,
      title,
      overview,
      vote_count,
      vote_average,
      release_date,
      media_type
    }

const fetchFolderData = async () => {
  const token = localStorage.getItem("streamhaven-token");
  if (!token) return;

  try {
    const res = await apiHelper.getAuthorization("/user/userfolder", token);
    if (res?.folders) {
      console.log(res.folders);
      setFolders(res.folders);
    }
  } catch (err) {
    console.error("Failed to fetch folders", err);
  }
};

useEffect(() => {
  if (isLoggedIn) {
    fetchFolderData();
  }
}, [isLoggedIn]);

    

  const handleClick = (folderName, movieInfo) => {
    console.log(checkMovie(folderName, movieInfoFiltered.id))

      if(checkMovie(folderName, movieInfoFiltered.id)){
          console.log("delete movie")
          const res = deleteMovieFromLocal(folderName, movieInfoFiltered.id)

          if(res){
              toast.success(`Removed Movie Form "${folderName}"`)
          }else{
              toast.error(`Limit Reached,Login for more`)
          }

      }else if(!checkMovie(folderName, movieInfoFiltered.id)){
        console.log("save movie")

          const res = saveMovieToLocal(folderName, movieInfo)
          if(res){
              toast.success(`Saved Movie To "${folderName}"`)
          }else{
              toast.error(`Limit Reached,Login for more`)
          }
      }
        setRefresh(prevValue => !prevValue)
  }

const checkCloudData = (folderId, movieId) => {
  const folder = folders.find(f => f._id === folderId);
  return folder?.saved?.some(movie => movie.id === movieId) || false;
};
  
  const submitNewFolder = async () => {
  if (newFolderInput.includes(" ") || newFolderInput.length > 10) {
    setError(true);
    return;
  }

  setError(false);
  const token = localStorage.getItem("streamhaven-token");
  const payload = { folder_name: newFolderInput };

  toast.promise(
    apiHelper
      .postAuthorization("/user/addfolder", payload, token)
      .then(res => {
        if (!res.condition) throw new Error(res.message);
        toast.success(res.message, { duration: 1000 });
        fetchFolderData();
        setNewFolderInput("");
        setAddFolder(false);
        if(onCloudUpdate) onCloudUpdate()
      }),
    {
      loading: "Creating folder...",
      success: "Folder created!",
      error: (err) => err.message || "Failed to create folder"
    }
  );
};

  const saveMovieToCloud = async (folderId, movieInfo) => {
  const token = localStorage.getItem("streamhaven-token");
  const payload = { folderId, movie: movieInfo };

  toast.promise(
    apiHelper
      .postAuthorization("/user/savemovie", payload, token)
      .then(res => {
        if (!res.condition) throw new Error(res.message);
        toast.success(res.message, { duration: 1000 });
        fetchFolderData();
        if(onCloudUpdate) onCloudUpdate()
      }),
    {
      loading: "Saving...",
      success: "Movie saved!",
      error: (err) => err.message || "Failed to save movie"
    }
  );
};
  
  const unSaveMovieFromCloud = async (folderId, movieId) => {
  const token = localStorage.getItem("streamhaven-token");
  const payload = { folderId, movieId };

  toast.promise(
    apiHelper
      .postAuthorization("/user/unsavemovie", payload, token)
      .then(res => {
        if (!res.condition) throw new Error(res.message);
        toast.success(res.message, { duration: 1000 });
        fetchFolderData();
        if(onCloudUpdate)onCloudUpdate()
      }),
    {
      loading: "Removing...",
      success: "Movie removed!",
      error: (err) => err.message || "Failed to remove movie"
    }
  );
};
  
  

  return (
    <div>
          
          
          {isLoggedIn ? (
            <>
              {folders?.length > 0 &&
                folders.map((eachFolder) => (
                  <div onClick={()=>checkCloudData(eachFolder._id, movieInfo.id) ? unSaveMovieFromCloud(eachFolder._id, movieInfo.id): saveMovieToCloud(eachFolder._id, movieInfoFiltered)} className={`${checkCloudData(eachFolder._id, movieInfo.id) ? "bg-primary-color border-primary" : ""} border cursor-pointer p-2 text-center rounded-[5px] mb-4`} key={eachFolder._id}>
                    <p>{eachFolder.folder_name}</p>
                  </div>
                ))
              }

              {addFolder ? (
                <div>
                  {error && (
                    <small className="text-red-500 font-bold">*No spaces, max 10 characters</small>
                  )}
                <input
                  className="text-center text-black p-[.5rem] w-full rounded-[3px] mb-2"
                  type="text"
                  placeholder="newfolder"
                  value={newFolderInput}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\s/g, "").slice(0, 10);
                    setNewFolderInput(value);
                  }}
                />

                  <div className="flex gap-[1rem] h-9">
                    <button 
                      className="w-full border rounded-[3px] cursor-pointer" 
                      onClick={() => setAddFolder(prevValue => !prevValue)}
                    >
                      Cancel
                    </button>
                    <button onClick={submitNewFolder} className="w-full bg-primary-color-and-hover cursor-pointer rounded-[3px] border border-primary">
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setAddFolder(prevValue => !prevValue)} 
                  className="bg-primary-color-and-hover border border-primary rounded-[3px] p-[.5rem] cursor-pointer flex justify-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div>
              <p 
                className={`${checkMovie("Liked", movieInfoFiltered.id) ? "bg-primary-color border-primary border" : "border"} cursor-pointer p-2 text-center rounded-[5px] mb-4`} 
                onClick={() => handleClick("Liked", movieInfoFiltered)}
              >
                Liked
              </p>
              <p 
                className={`${checkMovie("Watchlater", movieInfoFiltered.id) ? "bg-primary-color border-primary border" : "border"} cursor-pointer p-2 text-center rounded-[5px] mb-4`} 
                onClick={() => handleClick("Watchlater", movieInfoFiltered)}
              >
                Watch Later
              </p>
            </div>
          )}


    </div>
    // <div>
    //   <p onClick={()=>test()}>test</p>
    // </div>
    
  )
}

export default SaveOption

