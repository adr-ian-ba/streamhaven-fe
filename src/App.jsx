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
import VerifyGroup from "./component/VerifyGroup"
import RegisterGroup from "./component/RegisterGroup"
import LoginGroup from "./component/LoginGroup"
import ForgetPassGroup from "./component/ForgetPassGroup"
import SavePage from "./page/SavePage";
import HistoryPage from "./page/HistoryPage";

function App() {
  const {setLocalSave, setIsLoggedIn, setUsername, setTrendingMovies, setTrendingSeries, isLoggedIn, dialogMode, setDialogMode, dialogOpen, setDialogOpen, setProfile} = useContext(UserContext)
  const [haveFetched, setHaveFetched] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("streamhaven-token");
    if (!token) return;

    const payload = { token };

    apiHelper
      .post("/auth/check-auth", payload)
      .then((response) => {
        if (response.message === "Invalid token" || response.message === "Invalid Token or User Not Found") {
          localStorage.removeItem("streamhaven-token");
          return;
        }

        if (!response.condition) return;

        console.log(response)
        setIsLoggedIn(true);
        setUsername(response.username);
        setProfile(response.profile)
      })
      .catch((error) => {
        // Handle known errors (429 / 401)
        if (error.message.includes("401")) {
          localStorage.removeItem("streamhaven-token");
          toast.error("🔒 Session expired. Please log in again.");
        } else if (error.response?.status === 429) {
          toast.error("🚨 Too many requests. Slow down.");
        } else {
          toast.error("🚨 Authentication failed.");
        }
      });
  }, []);

  
  useEffect(() => {
    if (haveFetched) return;

    apiHelper
      .get("/media/getmovie")
      .then((response) => {
        if (!response.condition) {
          toast.error(response.message);
          return;
        }

        setTrendingMovies(response.result.trendingMovies);
        setTrendingSeries(response.result.trendingSeries);
        setHaveFetched(true);
      })
      .catch((error) => {
        console.error("Fetch error:", error.message);
        toast.error("🚨 Failed to fetch movies.");
      });
  }, [haveFetched]);

  useEffect(()=>{
    if(!isLoggedIn){
      const localSave = localStorage.getItem("local-save")

      if(!localSave){
        const initialSeed = [
          {
            folder_name : "Liked",
            folder_id : "-",
            saved : []
          },
          {
            folder_name : "Watchlater",
            folder_id : "-",
            saved : []
          }
        ]

        localStorage.setItem("local-save", JSON.stringify(initialSeed))
        setLocalSave(initialSeed)
      }
    }
  },[])

  const toggleDialog = (mode) =>{
    if (mode) setDialogMode(mode)
    setDialogOpen(prevState => !prevState)
  }

  return (
    <>
      <Toaster />
      {dialogOpen &&
              <Dialog useTitle={false} useClose={true} closeFunction={toggleDialog} className="bg-red-500">
                {dialogMode == "login" && (
                    <div>
                        <LoginGroup />
                        <p className="max-w-[20rem] text-center mx-auto">Did You <span onClick={() => setDialogMode("forget")} className="color-primary font-bold cursor-pointer">Forget Password 😭😭😭</span></p>
                    </div>
                )}
                {dialogMode == "register" && (
                    <div>
                        <RegisterGroup />
                        <p className="max-w-[20rem] text-center mx-auto">Activate Your Account <span onClick={() => setDialogMode("verify")} className="color-primary font-bold cursor-pointer">Verify</span></p>
                    </div>
                )}
                {dialogMode == "verify" && (
                    <div>
                        <VerifyGroup />
                        <p className="max-w-[20rem] text-center mx-auto">Before Verifying You Have to <br /><span className="color-primary font-bold cursor-pointer" onClick={() => setDialogMode("register")}>Register</span> Or <span className="color-primary font-bold cursor-pointer" onClick={()=>setDialogMode("login")}>Login</span></p>
                    </div>
                )}
                {dialogMode == "forget" && (
                    <div>
                        <ForgetPassGroup />
                        <p className="max-w-[20rem] text-center mx-auto">Have you Changed it ? <span onClick={() => setDialogMode("login")} className="color-primary font-bold cursor-pointer">Login</span></p>
                    </div>
                )}
              </Dialog>
            }
      <Routes>
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<AllPage />} />
        <Route path="/user/:type" element={<ProfilePage />} />
        <Route path="/save" element={<SavePage />} />
        <Route path="/history" element={<HistoryPage />} />
        
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/serie" element={<SeriePage/>}/>

        <Route path="/movie/:category/:page" element={<MovieCategoryPage />}/>
        <Route path="/serie/:category/:page" element={<SerieCategoryPage />}/>
        <Route path="/search/:page" element={<SearchPage />}/>

        <Route path="/verify/:email?/:otp?" element={<VerifyPage />} />
        <Route path="/resetpass/:email?/:otp?" element={<ResetPassPage />} />
        <Route path="/watch/:id/:type/:ss?/:ep?" element={<WatchPage />}/>

        <Route path="/anime/:page"/>
        <Route path="/filter"/>
      </Routes>
    </>
  );
}

export default App;
