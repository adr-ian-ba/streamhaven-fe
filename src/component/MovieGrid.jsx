/* eslint-disable react/prop-types */

import Poster from "./Poster";

const MovieGrid = ({ children, className = '', movies, renderType = "normal", folderName,folderId, onCloudUpdate }) => {

  return (
    <div className={`${className}`}>
      {children}
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {
          movies.map((eachMovie, index) => (
              <Poster renderType={renderType} folderName={folderName} folderId={folderId} movie={eachMovie} key={index} onCloudUpdate={onCloudUpdate}/>
          ))
        }
        
        
      </div>
    </div>
  );
};

export default MovieGrid;
