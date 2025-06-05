import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import AllPage from "./page/AllPage";
import VerifyPage from "./page/VerifyPage";
import { useContext, useEffect, useState } from "react";
import apiHelper from "./helper/ApiHelper";
import { UserContext } from "./helper/UserContext";
import ResetPassPage from "./page/ResetPassPage";
import toast, { Toaster } from "react-hot-toast";
import AdminPage from "./page/AdminPage";
import WatchPage from "./page/WatchPage";
import MoviePage from "./page/MoviePage";
import MovieCategoryPage from "./page/MovieCategoryPage";
import SeriePage from "./page/SeriePage";
import SerieCategoryPage from "./page/SerieCategoryPage";
import SearchPage from "./page/SearchPage";
import ProfilePage from "./page/ProfilePage";
import Dialog from "./component/Dialog";
import VerifyGroup from "./component/VerifyGroup";
import RegisterGroup from "./component/RegisterGroup";
import LoginGroup from "./component/LoginGroup";
import ForgetPassGroup from "./component/ForgetPassGroup";
import SavePage from "./page/SavePage";
import HistoryPage from "./page/HistoryPage";
import NotFound from "./page/NotFound";
import FilterPage from "./page/FilterPage";

function App() {
    const {
        setLocalSave,
        setIsLoggedIn,
        setUsername,
        setTrendingMovies,
        setTrendingSeries,
        isLoggedIn,
        dialogMode,
        setDialogMode,
        dialogOpen,
        setDialogOpen,
        setProfile,
    } = useContext(UserContext);

    const [haveFetched, setHaveFetched] = useState(false);
    const [serverWaking, setServerWaking] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");

        if (tokenFromUrl) {
        localStorage.setItem("streamhaven-token", tokenFromUrl);
        // Optionally clean URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        }

        const token = localStorage.getItem("streamhaven-token");
        if (!token) return;

        apiHelper
            .post("/auth/check-auth", { token })
            .then((res) => {
                if (!res.condition) return;
                setIsLoggedIn(true);
                setUsername(res.username);
                setProfile(res.profile);
                console.log(res)

                if (!res.isVerified) {
                    const lastShown = localStorage.getItem("verify-warning-last-shown");
                    const today = new Date().toDateString();

                    if (lastShown !== today && res.expiresIn !== null) {
                        const expiresAt = Date.now() + res.expiresIn;

                        const ToastContent = ({ t }) => {
                            const [remaining, setRemaining] = useState(res.expiresIn);

                            useEffect(() => {
                                const interval = setInterval(() => {
                                    setRemaining(Math.max(0, expiresAt - Date.now()));
                                }, 1000);
                                return () => clearInterval(interval);
                            }, []);
                            const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
                            const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);


                            return (
                                <div className="bg-gray-900 text-white p-4 rounded-md shadow-lg max-w-xs w-full">
                                    <strong className="block text-yellow-400 mb-1">
                                        ⚠️ Unverified Account
                                    </strong>
                                    <p className="text-sm">
                                        Please verify your email to avoid account deletion.
                                    </p>
                                    <p className="mt-2 text-sm">
                                        Time left:{" "}
                                        <span className="font-semibold text-red-400">
                                            {days}d {hours}h {minutes}m {seconds}s
                                        </span>
                                    </p>
                                    <button
                                        className="mt-4 px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                                        onClick={() => {
                                            requestAnimationFrame(() => toast.dismiss(t.id));
                                        }}
                                    >
                                        Got it
                                    </button>

                                </div>
                            );
                        };

                        toast.custom((t) => <ToastContent t={t} />, { duration: Infinity });
                        localStorage.setItem("verify-warning-last-shown", today);
                    }
                }
            })
            .catch((err) => {
                if (err.message.includes("401")) {
                    localStorage.removeItem("streamhaven-token");
                    toast.error("🔒 Session expired. Please log in again.");
                } else if (err.response?.status === 429) {
                    toast.error("🚨 Too many requests. Slow down.");
                } else {
                    toast.error("🚨 Authentication failed.");
                }
            });
    }, []);

    const fetchTrendingWithRetry = async (maxRetries = 10, delay = 3000) => {
        setServerWaking(true);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const res = await apiHelper.get("/media/getmovie");
                if (res.condition) {
                    setTrendingMovies(res.result.trendingMovies);
                    setTrendingSeries(res.result.trendingSeries);
                    setHaveFetched(true);
                    setServerWaking(false);
                    return;
                } else {
                    throw new Error(res.message || "Failed");
                }
            } catch (err) {
                setRetryCount(attempt);
                await new Promise((res) => setTimeout(res, delay));
            }
        }

        toast.error("🚨 Server failed to respond after several attempts.");
        setServerWaking(false);
    };

    useEffect(() => {
        if (!haveFetched) fetchTrendingWithRetry();
    }, [haveFetched]);

    useEffect(() => {
        if (!isLoggedIn) {
            const localSave = localStorage.getItem("local-save");

            if (!localSave) {
                const initialSeed = [
                    { folder_name: "Liked", folder_id: "-", saved: [] },
                    { folder_name: "Watchlater", folder_id: "-", saved: [] },
                ];
                localStorage.setItem("local-save", JSON.stringify(initialSeed));
                setLocalSave(initialSeed);
            }
        }
    }, []);

    const toggleDialog = (mode) => {
        if (mode) setDialogMode(mode);
        setDialogOpen((prev) => !prev);
    };

    return (
        <>
            <Toaster />
            {serverWaking && (
                <div className="fixed inset-0 bg-black/80 z-[9999] text-white flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-2xl font-semibold mb-2">
                        ⏳ Waking up Stream Haven server...
                    </h1>
                    <p className="text-sm text-gray-300 mb-1">
                        To save costs, the backend sleeps when unused. It's spinning up now!
                    </p>
                    <p className="text-xs text-gray-400">Retrying... (attempt {retryCount})</p>
                </div>
            )}

            {dialogOpen && (
                <Dialog useTitle={false} useClose={true} closeFunction={toggleDialog}>
                    {dialogMode === "login" && (
                        <div>
                            <LoginGroup />
                            <p className="max-w-[20rem] text-center mx-auto">
                                Did You{" "}
                                <span
                                    onClick={() => setDialogMode("forget")}
                                    className="color-primary font-bold cursor-pointer"
                                >
                                    Forget Password 😭😭😭
                                </span>
                            </p>
                        </div>
                    )}
                    {dialogMode === "register" && (
                        <div>
                            <RegisterGroup />
                            <p className="max-w-[20rem] text-center mx-auto">
                                Activate Your Account{" "}
                                <span
                                    onClick={() => setDialogMode("verify")}
                                    className="color-primary font-bold cursor-pointer"
                                >
                                    Verify
                                </span>
                            </p>
                        </div>
                    )}
                    {dialogMode === "verify" && (
                        <div>
                            <VerifyGroup />
                            <p className="max-w-[20rem] text-center mx-auto">
                                Before Verifying You Have to <br />
                                <span
                                    className="color-primary font-bold cursor-pointer"
                                    onClick={() => setDialogMode("register")}
                                >
                                    Register
                                </span>{" "}
                                Or{" "}
                                <span
                                    className="color-primary font-bold cursor-pointer"
                                    onClick={() => setDialogMode("login")}
                                >
                                    Login
                                </span>
                            </p>
                        </div>
                    )}
                    {dialogMode === "forget" && (
                        <div>
                            <ForgetPassGroup />
                            <p className="max-w-[20rem] text-center mx-auto">
                                Have you Changed it?{" "}
                                <span
                                    onClick={() => setDialogMode("login")}
                                    className="color-primary font-bold cursor-pointer"
                                >
                                    Login
                                </span>
                            </p>
                        </div>
                    )}
                </Dialog>
            )}

            <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/" element={<AllPage />} />
                <Route path="/user/:type" element={<ProfilePage />} />
                <Route path="/save" element={<SavePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/movie" element={<MoviePage />} />
                <Route path="/serie" element={<SeriePage />} />
                <Route path="/movie/:category/:page" element={<MovieCategoryPage />} />
                <Route path="/serie/:category/:page" element={<SerieCategoryPage />} />
                <Route path="/search/:page" element={<SearchPage />} />
                <Route path="/verify/:email?/:otp?" element={<VerifyPage />} />
                <Route path="/resetpass/:email?/:otp?" element={<ResetPassPage />} />
                <Route path="/watch/:id/:type/:ss?/:ep?" element={<WatchPage />} />
                <Route path="/anime/:page" />
                <Route path="/filter" element={<FilterPage />}/>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
