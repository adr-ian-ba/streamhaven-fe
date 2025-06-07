/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from "react";
import Genre from "./Genre";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import SaveOption from "./SaveOption";
import { UserContext } from "../helper/UserContext";
import { deleteMovieFromLocal, saveMovieToLocal } from "../helper/SaveHelper";
import toast from "react-hot-toast";
import apiHelper from "../helper/ApiHelper";

const pendingDeletions = new Map();

const Poster = ({ movie, renderType = "normal", folderName, folderId, onCloudUpdate }) => {
  const containerRef = useRef(null)
  const [isNearRightEdge, setIsNearRightEdge] = useState(false)
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const {isLoggedIn, toggleDialog} = useContext(UserContext)

  const toggleOpen = () =>{
    setDialogOpen(prevState => !prevState)
  }
  const showUndoToast = (key, mode) => {
  toast((t) => (
    <div className="text-sm text-white">
      <p>
        {mode === "local"
          ? `Movie removed from ${folderName}.`
          : `Movie removed from cloud folder ${folderName}.`}
      </p>
      <button
        className="mt-2 underline color-primary font-bold cuursor-pointer"
        onClick={() => {
          clearTimeout(pendingDeletions.get(key));
          pendingDeletions.delete(key);

          if (mode === "local") {
            saveMovieToLocal(folderName, movie)
          } else if (mode === "cloud") {
            if (onCloudUpdate) {
              onCloudUpdate((prev) => {
                const updated = { ...prev };
                updated[folderName] = [...(updated[folderName] || []), movie];
                return updated;
              });
            }
          }

          toast.dismiss(t.id);
        }}
      >
        Undo
      </button>
    </div>
  ), {
    duration: 8000,
    position : "bottom-right",
    style: {
      background: "#1a1a1a",
      padding: "12px",
    },
  });
};

  useEffect(() => {
    const checkPosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setIsNearRightEdge(rect.right > window.innerWidth - 200)
      }
    };
    window.addEventListener("resize", checkPosition)
    checkPosition()

    return () => window.removeEventListener("resize", checkPosition)
  }, [])

  const handleClick = (id, type, ss) => {
    let path = `/watch/${id}/${type}`;
  
    if (movie.media_type === "SR") {
      path += ss === undefined ? `/1/1` : `/${ss}/1`;
    } else if (ss !== undefined) {
      path += `/${ss}/1`;
    }
  
    navigate(path);
  };

  const handleDeleteLocal = (folderName, movieId) => {
    deleteMovieFromLocal(folderName, movieId)
  }
  
const handleDeleteCloud = async () => {
    const payload = { folderId, movieId: movie.id };
    const token = localStorage.getItem("streamhaven-token");

    try {
      const res = await apiHelper.postAuthorization("/user/unsavemovie", payload, token);

      if (!res.condition) {
        toast.error(res.message || "Failed to remove movie");
        return;
      }

      toast.success("Movie removed from cloud");

      if (onCloudUpdate) onCloudUpdate();

    } catch (err) {
      toast.error("Cloud remove failed");
    }
  };

const handleDelete = () => {
  const key = `${folderName}-${movie.id}`;

  // --- Delete from LOCAL ---
  if (renderType === "local") {
    handleDeleteLocal(folderName, movie.id); // Remove immediately

    const timeoutId = setTimeout(() => {
      pendingDeletions.delete(key);
      // No further action needed; already deleted
    }, 8000);

    pendingDeletions.set(key, timeoutId);

    showUndoToast(key, "local");

  // --- Delete from CLOUD ---
  } else if (renderType === "cloud") {
    // Remove from UI immediately (optimistically)
    if (onCloudUpdate) onCloudUpdate((prev) => {
      const updated = { ...prev };
      updated[folderName] = updated[folderName].filter(m => m.id !== movie.id);
      return updated;
    });

    const timeoutId = setTimeout(async () => {
      try {
        const token = localStorage.getItem("streamhaven-token");
        const payload = { folderId, movieId: movie.id };
        const res = await apiHelper.postAuthorization("/user/unsavemovie", payload, token);
        if (!res.condition) toast.error("Failed to delete from cloud");
      } catch {
        toast.error("Cloud deletion failed");
      }
      pendingDeletions.delete(key);
    }, 8000);

    pendingDeletions.set(key, timeoutId);

    showUndoToast(key, "cloud");
  }
};




  return (
    <div ref={containerRef} className="group relative">
      {dialogOpen && 
        <Dialog useClose={true} useTitle={true} title="Save" closeFunction={toggleOpen}>
          <SaveOption movieInfo={movie} onCloudUpdate={onCloudUpdate}/>
          {!isLoggedIn && (
            <p onClick={()=> {toggleDialog("login"); toggleOpen()}} className="cursor-pointer p-2 text-center rounded-[5px] bg-primary-color-and-hover">Login</p>
          )}
        </Dialog>
      }
      <div className="relative cursor-pointer poster-group">
        <div className="flex absolute top-0 right-0 m-2 gap-2">  
          <div className="flex px-2 py-1 items-center z-10 rounded-[3px] bg-black/50 gap-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3 fill-amber-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
            </svg>
            <h5 className="text-[.7rem]">{Math.floor(movie.vote_average)}</h5>
          </div>

          {!["local", "cloud"].includes(renderType) && (
            <div
              onClick={toggleOpen}
              className="group z-10 rounded-[3px] bg-black/50 h-fit p-1 cursor-pointer hover:scale-115 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="size-4 fill-gray-300 group-hover:fill-white transition-colors duration-300"
              >
                <path d="M3.75 2a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.28.53L8 10.06l3.72 3.72a.75.75 0 0 0 1.28-.53V2.75a.75.75 0 0 0-.75-.75h-8.5Z" />
              </svg>
            </div>
          )}



          {["local", "cloud"].includes(renderType) && folderName && (
              <div onClick={handleDelete} className="z-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6 bg-white fill-amber-300 rounded-[3px] cursor-pointer" onClick={()=>console.log("test")}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>          
              </div>
            )}
        </div>


        <div className="cursor-pointer aspect-[9/13] overflow-hidden rounded-[3px]">
          <img
            onClick={()=>(handleClick(movie.id, movie.media_type))}
            className="w-full h-full object-fill transition-all duration-200 group-hover:scale-110"
            src={movie.poster_path}
            alt={movie.title}
          />
        </div>

        <div className="flex items-center justify-between mt-[.5rem] gap-4">

          <p className="group-hover:font-bold text-center text-white truncate transition-all duration-200">
            {movie.title}
          </p>

        </div>

        <div className={`text-sm ${movie.media_type == "SR" ? "flex justify-between" : ""}`}>
          {movie.media_type == "SR" && (
            movie.seasons && (
            <div>
              <p>SS {movie.seasons.length} - EPS {movie.seasons[movie.seasons.length - 1].episode_count}</p>
            </div>
            )
          )}
          <div className="text-sm flex items-center flex-nowrap gap-1 mb-[1rem]">
              <p className="group-hover:font-bold text-center text-white truncate text-[.7rem] transition-all duration-200">{movie.release_date ? movie.release_date.split("-")[0] : ""}</p>
              <p className="group-hover:font-bold text-center text-white truncate text-[.7rem] transition-all duration-200">{movie.runtime ? `- ${movie.runtime}m` : ""}</p>
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none opacity-0 rounded-[5px] group-hover:delay-350 p-4 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 absolute ${
          isNearRightEdge ? "right-1/4" : "left-1/4"
        } top-3/5 bg-black/50 backdrop-blur-sm w-[18rem] z-20`}
      >
        <h1 className="text-lg">{movie.title}</h1>
        <p className="text-[.8rem] mb-[1rem] whitespace-normal line-clamp-6 truncate">
          {movie.overview}
        </p>

        <div className="flex justify-between items-center mb-[1rem] text-sm">
          <div className="flex gap-2 items-center">
            {/* Your SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 fill-amber-400"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
            <h5>{movie.vote_average}</h5>
            <h5>/</h5>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>

            <h5 className="">
               {movie.vote_count}
            </h5>

            
          </div>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10 fill-white cursor-pointer p-2"
          >
            <path
              fillRule="evenodd"
              d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
              clipRule="evenodd"
            />
          </svg> */}

          {movie.release_date && (
            <div className=" flex items-center">
                <h5 className="group-hover:font-bold text-center truncate transition-all duration-200">{movie.release_date.split("-")[0]  || "N/A"}  {movie.runtime ? `• ${movie.runtime}m` : ""}</h5>
            </div>
          )}
        </div>


        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre && (
            movie.genres.map((eachGenre, index) => (
              <Genre genre={eachGenre.name || ""}  key={index}/>
            ))
          )
          }
        </div>

        <div className="flex flex-col gap-[.5rem]">
            <div className="max-h-[8rem] overflow-x-hidden overflow-y-auto custom-scrollbar">

            {movie.seasons && (
              movie.seasons
                .filter(eachSeason => eachSeason.season_number !== 0) 
                .map((eachSeason, index) => (
                  <div 
                    onClick={() => handleClick(movie.id, movie.media_type, eachSeason.season_number)}
                    key={index} 
                    className="text-sm flex  justify-between mr-2 p-2 border rounded-[5px] cursor-pointer mb-[.5rem] gap-2 flex-nowrap"
                  >
                    <p className="color-white truncate">{eachSeason.name}</p>
                    <p className="color-white text-nowrap">EPS {eachSeason.episode_count}</p>
                  </div>
                ))
            )}


            </div>
            


            <div onClick={toggleOpen} className="border rounded-[3px] p-1 cursor-pointer transition-all duration-200 hover:bg-white hover:text-black flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            {movie.media_type === "SR" && movie.seasons?.length > 0 ? null : (
              <button onClick={() => handleClick(movie.id, movie.media_type)} className=" border border-primary bg-primary-color-and-hover rounded-[3px] p-1 cursor-pointer flex justify-center">
                Watch
              </button>
            )}

        </div>
      </div>
    </div>
  );
};

export default Poster;
