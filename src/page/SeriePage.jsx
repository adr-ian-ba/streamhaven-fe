import { useEffect, useState } from 'react'
import Footer from '../component/Footer'
import Navigation from '../component/Navigation'
import apiHelper from '../helper/ApiHelper'
import toast from 'react-hot-toast'
import MovieGrid from '../component/MovieGrid'
import { useNavigate } from 'react-router-dom'
import Loading from '../component/Loading'

const SeriePage = () => {
    const [popular, setPopular] = useState(null)
    const [top, setTop] = useState(null)
    const [airing, setAiring] = useState(null)
    const [nextSeven, setNextSeven] = useState(null)

    const navigate = useNavigate()


    useEffect(()=>{
        apiHelper.get("/media/getmovies/SR").then((response)=>{
  
            console.log(response)
            if(!response.condition) {
              toast.error(response.message) 
              return
            }

            setAiring(response.result.airing)
            setPopular(response.result.popular)
            setTop(response.result.top)
            setNextSeven(response.result.nextSeven)
          })
    }, [])

    const handleNavigate = (category, page) => {
        navigate(`/serie/${category}/${page}`)
    }

    if(!nextSeven && !popular && !top && !airing){
        return <Loading />
    }
  return (
    <div className='background-color min-h-[100vh]'>
        <Navigation />

        <div className='pt-25 relative mx-4 2xl:mx-[8rem]'>
            
            <MovieGrid className='mb-10' movies={top}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Top Rated</h1>
                    <button onClick={()=>handleNavigate("top", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid >
            <MovieGrid className='mb-10' movies={popular}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Popular</h1>
                    <button onClick={()=>handleNavigate("popular", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid >
            <MovieGrid className='mb-10' movies={airing}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Airing Today</h1>
                    <button onClick={()=>handleNavigate("airing", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid>
            <MovieGrid className='mb-10' movies={nextSeven}>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-[2rem] font-bold">Next 7 Days</h1>
                    <button onClick={()=>handleNavigate("next-seven", 1)} className="bg-primary-color-and-hover px-6 h-[2rem] cursor-pointer rounded-[3px]">See All</button>
                </div>
            </MovieGrid>
        </div>

        <Footer />
        

    </div>
  )
}

export default SeriePage