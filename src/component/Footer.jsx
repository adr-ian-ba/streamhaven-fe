
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className=" bg-primary-color">
    <div className="p-10 flex justify-center flex-wrap gap-10 mt-[10rem]">

      <img className='max-w-[5rem] h-auto' src="/image/SH Short White.png" alt="" />

      <div className="max-w-[14rem]">
        <h1>About Us</h1>
        <p className="text-sm">Explore. Save. Watch. Your personalized movie & TV space — where freedom meets fandom.</p>
      </div>

      <div className="flex flex-col">
        <h1>Quick Links</h1>
        <Link to="/home">About</Link>
        <Link to="/home">Values</Link>
        <Link to="/home">supporters</Link>
        <Link to="/privacy">Privacy & Policy</Link>
        <Link to="/term">Terms Of Service</Link>

        {/* <Link to="/home#about">About</Link>
        <Link to="/home#values">Values</Link>
        <Link to="/home#supporters">supporters</Link> */}
      </div>

      <div>
        <Link className='font-bold color-white' to="/home">Home</Link >
        <h1><a href="https://instagram.com/stream.haven.official" target='_blank'>Instagram</a></h1>
        <h1><a href="https://saweria.co/StreamHavenOfficial" target='_blank'>Donate</a></h1>
      </div>
    </div>

      <div className="flex items-center pb-[3rem] px-10">
        <div className="flex-grow border-t border-gray-300" />
        <span className="px-4 text-gray-300 text-sm">© 2025 StreamHaven. All rights reserved.</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

  </footer>
  )
}

export default Footer