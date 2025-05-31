import { useEffect, useState } from 'react'
import Footer from '../component/Footer'
import Navigation from '../component/Navigation'
import apiHelper from '../helper/ApiHelper'
import toast from 'react-hot-toast'
import MovieGrid from '../component/MovieGrid'
import { useNavigate } from 'react-router-dom'
import Loading from '../component/Loading'

const MoviePage = () => {
    const [now, setNow] = useState(null)
    const [popular, setPopular] = useState(null)
    const [top, setTop] = useState(null)
    const [upcoming, setUpcoming] = useState(null)

    const navigate = useNavigate()


  useEffect(() => {
    apiHelper.get("/media/getmovies/MV")
      .then((response) => {
        if (!response.condition) {
          toast.error(response.message);
          return;
        }

        setNow(response.result.now);
        setPopular(response.result.popular);
        setTop(response.result.top);
        setUpcoming(response.result.upcoming);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        toast.error("Failed to load movies.");
      });
  }, []);

  const handleNavigate = (category, page = 1) => {
    navigate(`/movie/${category}/${page}`);
  };

    if(!now && !popular && !top && !upcoming){
        return <Loading />
    }
  return (
    <div className='background-color min-h-[100vh]'>
        {/* <Toaster /> */}
        <Navigation />

        <div className='pt-25 relative mx-4 2xl:mx-[8rem]'>
            
            <MovieGrid className='mb-10' movies={now}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Now Playing</h1>
                    <button onClick={()=>handleNavigate("now-playing", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid >
            <MovieGrid className='mb-10' movies={popular}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Popular</h1>
                    <button onClick={()=>handleNavigate("popular", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid >
            <MovieGrid className='mb-10' movies={top}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Trending</h1>
                    <button onClick={()=>handleNavigate("trending", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid>
            <MovieGrid className='mb-10' movies={upcoming}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Upcoming</h1>
                    <button onClick={()=>handleNavigate("upcoming", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid>
        </div>

        <Footer />

    </div>
  )
}

export default MoviePage