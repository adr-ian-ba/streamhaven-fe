export function saveMovieToLocal(folderName, movieInfo) {
  const localSave = JSON.parse(localStorage.getItem("local-save")) || [];

  let updated = false;
  let limitExceeded = false;

  const updatedLocalSave = localSave.map((eachFolder) => {
    if (eachFolder.folder_name.toLowerCase() === folderName.toLowerCase()) {
      if (!eachFolder.saved.some(movie => movie.id === movieInfo.id)) {
        if (eachFolder.saved.length >= 10) {
          limitExceeded = true;
          return eachFolder;
        }

        updated = true;
        return {
          ...eachFolder,
          saved: [movieInfo, ...eachFolder.saved]
        };
      }
    }
    return eachFolder;
  });

  if (!updated) {
    const folderExists = localSave.some(f => f.folder_name.toLowerCase() === folderName.toLowerCase());

    // Create folder if it's a default type and doesn't exist
    const allowedFolders = ["liked", "watchlater", "history"];
    if (!folderExists && allowedFolders.includes(folderName.toLowerCase())) {
      updatedLocalSave.push({
        folder_name: folderName,
        saved: [movieInfo]
      });
    } else if (!folderExists || limitExceeded) {
      return false;
    }
  }

  localStorage.setItem("local-save", JSON.stringify(updatedLocalSave));
  window.dispatchEvent(new Event("localStorageUpdated"));
  return true;
}




export function deleteMovieFromLocal(folderName, movieId) {
    const localSave = JSON.parse(localStorage.getItem("local-save")) || [];
    
    let folderExist = false;

    const updatedLocalSave = localSave.map((eachFolder) => {
        if (eachFolder.folder_name.toLowerCase() === folderName.toLowerCase()) {
            folderExist = true;
            
            return {
                ...eachFolder,
                saved: eachFolder.saved.filter(movie => movie.id !== movieId) 
            };
        }
        return eachFolder;
    });

    if (!folderExist) return false;

    localStorage.setItem("local-save", JSON.stringify(updatedLocalSave));
    window.dispatchEvent(new Event("localStorageUpdated"));
    return true;
}


export function checkMovie(folderName, movieId) {
    const localSave = JSON.parse(localStorage.getItem("local-save")) || [];

    const findFolder = localSave.find(eachFolder =>
        eachFolder.folder_name.toLowerCase() === folderName.toLowerCase()
    );

    return findFolder?.saved.some(eachSave => eachSave.id == movieId) || false;
};



export function getMovieFromLocal(folderName) {
  const localSave = JSON.parse(localStorage.getItem("local-save")) || [];

  const selectedFolder = localSave.find(
    (eachFolder) => eachFolder.folder_name.toLowerCase() === folderName.toLowerCase()
  );

  return selectedFolder?.saved || [];
}

export function getAllFolders() {
  return JSON.parse(localStorage.getItem("local-save")) || [];
}

export function clearLocalSave() {
  localStorage.removeItem("local-save");
  window.dispatchEvent(new Event("localStorageUpdated"));
}

export const saveToLocalHistory = (movie) => {
  const raw = localStorage.getItem("local-save");
  const data = raw ? JSON.parse(raw) : [];

  const history = data.find(f => f.folder_name === "History") || { folder_name: "History", saved: [] };

  // Remove duplicate
  history.saved = history.saved.filter(m => m.id !== movie.id);

  // Add new item
  history.saved.unshift({ ...movie, watchedAt: new Date() });

  // Cap and remove expired (7 days)
  const now = new Date();
  history.saved = history.saved
    .filter(m => now - new Date(m.watchedAt) <= 7 * 24 * 60 * 60 * 1000)
    .slice(0, 50);

  const updatedData = data.filter(f => f.folder_name !== "History");
  updatedData.push(history);

  localStorage.setItem("local-save", JSON.stringify(updatedData));
};
