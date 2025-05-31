/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react"
import Navigation from "../component/Navigation"
import Genre from "../component/Genre"
import MovieGrid from "../component/MovieGrid"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../helper/UserContext"
import Footer from "../component/Footer"
import Loading from "../component/Loading"

const AllPage = () => {
  const [pick, setPick] = useState("movie")
  const {trendingMovies, trendingSeries} = useContext(UserContext)
  const [spotLight, setSpotLight] = useState({
    id : null,
    title : null,
    overview : null,
    vote_average : null,
    vote_count : null,
    genres : [null],
    backdrop_path : null,
    spot : null
  })

  useEffect(()=>{
    if(trendingMovies.length == 0 || trendingSeries.length == 0) return
    changeSpotLight(trendingMovies[0], 1)
  }, [trendingMovies, trendingSeries])

  const navigate = useNavigate()

  const topMobileRef = useRef(null)
  const topDesktopRef = useRef(null)

  const handleScroll = (dir) => {
    const scrollAmount = 300;
    const frames = 30; 
    
    [topDesktopRef, topMobileRef].forEach((ref) => {
      if (ref.current) {
        const start = ref.current.scrollLeft
        const end = dir === "left" ? start - scrollAmount : start + scrollAmount
        let frame = 0
  
        const animateScroll = () => {
          frame++
          const progress = frame / frames
          ref.current.scrollLeft = start + (end - start) * easeOutQuad(progress)
          
          if (frame < frames) {
            requestAnimationFrame(animateScroll)
          }
        }
  
        animateScroll()
      }
    })
  }
  const easeOutQuad = (t) => t * (2 - t)

  const changeSpotLight = (data, spot) => {
    setSpotLight({
      id : data.id,
      title : data.title,
      overview : data.overview,
      vote_average : data.vote_average,
      vote_count : data.vote_count,
      genres : data.genres,
      backdrop_path : data.backdrop_path,
      spot : spot
    })
  }
  
  const handleClick = (type) => {
    navigate(`/watch/${spotLight.id}/${type}`)
  }

  const setTrending = (pick) => {
    setPick(pick)
  }

  if(!trendingMovies || trendingMovies.length == 0 ||!trendingSeries || trendingSeries.length == 0){
    return(
      <Loading />
    )
  }

  

  return (
    <div className='background-color'>
      {/* <Toaster /> */}
      <Navigation />
        <div className='relative min-h-[100dvh] overflow-x-hidden overflow-y-hidden'>
            {spotLight && (
              <div className="absolute top-0 left-0 w-screen h-[80vh]">
                <div className="h-full w-full bg-black opacity-50 absolute inset-0"></div>
                <div className="w-full h-[10rem] absolute bottom-0 top-gradient"></div>
                <img className="w-full h-full object-cover" src={`${spotLight.backdrop_path}`} alt="" />

                <div className="absolute top-[28%] sm:top-[30%] mx-4 2xl:mx-[8rem] z-20">
                  <h1 className="text-[2.5rem] sm:text-[3rem] font-bold text-white break-words whitespace-normal w-full max-w-screen-xl mx-auto leading-10 mb-[0.5rem]">
                    {spotLight.title}
                  </h1>                  <p className="text-[.8rem] sm:text-sm max-w-[35rem] color-white overflow-hidden text-ellipsis line-clamp-4 mb-[.5rem]">{spotLight.overview}</p>


                  <div className="flex items-center gap-1 mb-[.5rem]">
                    <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 fill-amber-400">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                    <h5>{spotLight.vote_average}</h5>

                    <h5>/</h5>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    <h5>{spotLight.vote_count} - # {spotLight.spot}</h5>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {/* {spotLight.genres.map((eachGenre, index) => (
                      <Genre genre={eachGenre.name || ""} key={index} />
                    ))} */}

                    {spotLight?.genres?.filter(genre => genre !== null).map((eachGenre, index) => (
                      <Genre genre={eachGenre.name || ""} key={index} />
                    ))}

                  </div>
                <button onClick={()=>handleClick("MV")} className="watch-now">Watch Now</button>
                </div>
              </div>
              )}

            <div className="relative mx-4 2xl:mx-[8rem] pt-[70vh]">

              <div className="flex items-center gap-4 mb-[1rem]">  

                <h1 className="text-[2rem] font-bold">TOP 10</h1>
                <div className="flex h-full gap-2">
                  <div onClick={() => handleScroll("left")}  className="bg-primary-color p-1.5 rounded-[3px] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </div>

                  <div onClick={() => handleScroll("right")} className="bg-primary-color p-1.5 rounded-[3px] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                  
                </div>
              </div>
              
              
              <div ref={topDesktopRef} className="top-desktop flex gap-[12rem] overflow-x-scroll overflow-y-visible h-[18rem] hidden-scrollbar">
                {
                  trendingMovies.slice(0, 10).map((eachMovie, index) => (
                    <div onClick={()=> changeSpotLight(eachMovie, index+1)} className="relative cursor-pointer group" key={eachMovie.id}>
                        <div className={`absolute top-0 ${index+1 == 10 ? "left-30" : "left-20"} overflow-x-visible overflow-y-visible`}>
                          <div className="rounded-[3px] overflow-hidden">
                            <img src={`${eachMovie.poster_path}`} className="h-full w-full transition-all duration-200 group-hover:scale-110" alt="" />
                          </div>
                          <p className="mt-[.5rem] text-sm text-center w-[10rem] truncate">{eachMovie.title}</p>
                        </div>

                        <h1 className={`${spotLight.spot === index + 1 ? "color-primary" : ""} text-[10rem] leading-[15rem] w-[5rem] transition-all duration-200`}>{index + 1}</h1>

                    </div>
                  ))
                }
              </div>

              <div ref={topMobileRef} className="top-mobile flex gap-[1rem] overflow-auto h-[18rem] hidden-scrollbar">
                {
                  trendingMovies?.slice(0, 10).map((eachMovie, index) => (
                    <div onClick={()=> changeSpotLight(eachMovie, index+1)} className="relative" key={eachMovie.id}>
                      <img src={`${eachMovie.poster_path}`} className="rounded-[3px] cursor-pointer" alt="" />
                      <p className="mt-[.5rem] text-sm text-center w-[10rem] truncate">{eachMovie.title}</p>
                      <div className="w-[2rem] h-[2rem] rounded-bl-[5px] bg-primary-color rounded-tr-[3px] absolute right-0 top-0 grid place-items-center">
                        <h5 className="text-[.8rem]">#{index +1}</h5>
                      </div>
                    </div>
                  ))
                }
              </div>

            </div>

            {/* <MovieGrid movies={popular} className="relative mx-4 2xl:mx-[8rem] mt-[2rem]">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-[2rem] font-bold">Trending</h1>
                <button className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
              </div>
            </MovieGrid> */}

            <MovieGrid movies={pick === "movie" ? trendingMovies : trendingSeries} className="relative mx-4 2xl:mx-[8rem] mt-[2rem] mb-[14rem]">
              <div className="mb-[1rem]">
                <h1 className="text-[2rem] font-bold mb-[.5rem]">Trending</h1>
                <div className="flex items-center gap-4">
                  <p className={`border px-4 py-1 rounded-[3px] cursor-pointer ${pick === "movie" ? "bg-primary-color border-primary" : ""}`} onClick={()=> setTrending("movie")}>Movie</p>
                  <p className={`border px-4 py-1 rounded-[3px] cursor-pointer ${pick === "series" ? "bg-primary-color border-primary" : ""}`} onClick={()=> setTrending("series")}>TV Show</p>
                </div>
              </div>
            </MovieGrid>

        </div>
        
        <Footer />
    </div>
  )
}

export default AllPage