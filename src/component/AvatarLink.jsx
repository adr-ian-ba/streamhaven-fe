import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AvatarLink = ({ profile }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const img = new Image();
    img.onload = () => {
      // Optional: reject suspiciously small/blank images
      if (img.naturalWidth < 5 || img.naturalHeight < 5) {
        setHasError(true);
      } else {
        setIsLoaded(true);
      }
    };
    img.onerror = () => setHasError(true);
    img.src = profile;
  }, [profile]);

  return (
    <Link
      to="/user/profile"
      className="rounded-full h-[3rem] w-[3rem] aspect-square overflow-hidden relative"
    >
      {/* fallback loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center text-xs text-gray-700">
          <span>...</span>
        </div>
      )}

      {/* show avatar only when verified */}
      {isLoaded && !hasError && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${profile}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </Link>
  );
};

export default AvatarLink;
