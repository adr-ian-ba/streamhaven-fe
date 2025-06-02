import { useContext, useState } from "react";
import { UserContext } from "../helper/UserContext";
import apiHelper from "../helper/ApiHelper";
import UploadAvatarButton from "../component/UploadAvatarButton";
import toast from "react-hot-toast";
import ChangeUsername from "../component/ChangeUsername";
import Dialog from "../component/Dialog";
import Navigation from "../component/Navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LiveCountdown from "../component/LiveCountdown";

const ProfilePage = () => {
    const { setProfile, username, toggleDialog } = useContext(UserContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);


    const navigate = useNavigate();

    const token = localStorage.getItem("streamhaven-token");

    const handleDeleteAccount = () => {
        toast.promise(apiHelper.deleteAuthorization("/auth/delete-account", token), {
            loading: "Deleting account...",
            success: (res) => {
                localStorage.removeItem("streamhaven-token");
                setTimeout(() => (window.location.href = "/"), 1500);
                return res.message;
            },
            error: "Failed to delete account",
        });
    };

    const handleDeleteAvatar = () => {
        toast.promise(apiHelper.deleteAuthorization("/user/delete-avatar", token), {
            loading: "Deleting avatar...",
            success: (res) => {
                setProfile(null);
                return res.message;
            },
            error: "Failed to delete avatar",
        });
    };

    const handleClearHistory = () => {
        apiHelper
            .postAuthorization("/user/clearhistory", {}, token)
            .then((res) => {
                res.condition ? toast.success("History cleared.") : toast.error(res.message);
            })
            .catch(() => toast.error("Failed to clear history"));
    };

    const goBack = () => navigate(-1);

useEffect(() => {
    if (!token) return;

    apiHelper
        .getAuthorization("/auth/verify-status", token)
        .then((res) => {
            if (res.condition) {
                setEmail(res.email);
                setIsVerified(res.isVerified);
                setExpiresIn(res.expiresIn); // ⬅️ add this
            }
        })
        .catch((err) => {
            console.error("Failed to fetch verify status", err);
        });
}, []);

    return (
        <div className="background-color min-h-screen text-white py-20 px-4">
            <Navigation showSearch={false} />

            <div className="max-w-3xl mx-auto text-center">
                <div onClick={goBack} className="flex items-center gap-2 p-1 cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>
                    <h1>BACK</h1>
                </div>

                {/* Avatar Section */}
                <UploadAvatarButton />

                <button
                    onClick={handleDeleteAvatar}
                    className="mt-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm"
                >
                    Delete Avatar
                </button>

                {/* Username Display */}
                <h1 className="text-3xl font-bold mt-6">Welcome, {username}</h1>
                {email && (
                    <div className="mt-2 text-sm">
                        <p>
                            Email: <span className="font-semibold">{email}</span>
                        </p>
                        <p>
                            Status:{" "}
                            {isVerified ? (
  <span className="text-green-400 font-semibold">Verified ✅</span>
) : (
  <>
    <span className="text-red-500 font-semibold">
      Not Verified
      <button
        onClick={() => toggleDialog("verify")}
        className="ml-3 underline text-red-400 hover:text-red-300 text-sm cursor-pointer"
      >
        Verify Now
      </button>
      <br />
      <span className="text-amber-500 text-[.8rem]">
        (also check spam)
      </span>
    </span>

    {expiresIn !== null && (
      <LiveCountdown expiresIn={expiresIn} />
    )}
  </>
)}

                        </p>
                    </div>
                )}
                {/* Settings Section */}
                <div className="mt-10 space-y-8">
                    {/* Username Change */}
                    <ChangeUsername
                        onUpdate={(newName) => toast.success(`Username updated to ${newName}`)}
                    />

                    {/* Password & History Actions */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => toggleDialog("forget")}
                            className="bg-primary-color-and-hover hover:opacity-90 rounded px-4 py-2 text-sm"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Clear Watch History
                        </button>
                    </div>

                    {/* Donate Account */}
                    <div className="border-t border-gray-700 pt-6">
                        <h2 className="text-lg font-semibold mb-3">Donate And Get Mentioned</h2>
                        <div className="flex gap-2 w-fit mx-auto">
                            <button className="bg-yellow-500 hover:bg-yellow-800 text-white px-4 py-2 rounded cursor-pointer">
                                <a href="https://saweria.co/StreamHavenOfficial">Donate Saweria</a>
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-6">
                        <h2 className="text-lg font-semibold mb-3">Danger Zone</h2>
                        <div className="flex flex-col gap-4 w-fit mx-auto">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("streamhaven-token");
                                    window.location.reload();
                                }}
                                className=" bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Logout
                            </button>

                            <button
                                onClick={() => setShowConfirm(true)}
                                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <Dialog closeFunction={() => setShowConfirm(false)}>
                    <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
                    <p className="mb-4">This action is permanent and cannot be undone.</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 border border-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default ProfilePage;
