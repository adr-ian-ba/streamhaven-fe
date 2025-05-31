import { useState, useContext } from "react";
import { UserContext } from "../helper/UserContext";
import CropModal from "./CropModal";

const UploadAvatarButton = () => {
  const { profile } = useContext(UserContext);
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-[8rem] h-[8rem] mx-auto group rounded-full overflow-hidden">
      {/* Show spinner overlay if loading or error */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 z-10 bg-black/60 flex flex-col justify-center items-center text-white text-sm">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mb-1"></div>
          <p>Processing avatar...</p>
        </div>
      )}

      {/* Hidden image still tries to load */}
      <img
        src={profile}
        alt="Avatar"
        className="rounded-full object-cover w-full h-full border-4 border-white"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        style={{ display: hasError ? "none" : "block" }}
      />

      <div className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <label htmlFor="avatarInput" className="cursor-pointer">Edit</label>
        <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleSelect} />
      </div>



      {showCrop && (
        <CropModal imageSrc={imageSrc} onClose={() => setShowCrop(false)} />
      )}
    </div>
  );
};

export default UploadAvatarButton;
