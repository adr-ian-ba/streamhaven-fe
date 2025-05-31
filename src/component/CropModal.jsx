import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import apiHelper from "../helper/ApiHelper";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../helper/UserContext";
import getCroppedImg from "../helper/cropImage";

const CropModal = ({ imageSrc, onClose }) => {
  const { setProfile } = useContext(UserContext);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleUpload = async () => {
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 400);
    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");

    const token = localStorage.getItem("streamhaven-token");
    toast.promise(
      apiHelper.postFormAuthorization("/user/upload-avatar", formData, token),
      {
        loading: "Uploading...",
        success: (res) => {
          setProfile(res.profile);
          onClose();
          return "Profile updated!";
        },
        error: "Upload failed",
      }
    );

  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-[90vw] max-w-[500px]">
        <div className="relative w-full aspect-square bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-primary-color-and-hover text-white px-4 py-2 rounded" onClick={handleUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
