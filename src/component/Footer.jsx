
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="p-10 bg-primary-color flex justify-center flex-wrap gap-10 mt-[10rem]">
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
      {/* <Link to="/home#about">About</Link>
      <Link to="/home#values">Values</Link>
      <Link to="/home#supporters">supporters</Link> */}
    </div>

    <div>
      <Link className='font-bold color-white' to="/home">Home</Link >
      <h1><a href="https://instagram.com/stream.haven.official" target='_blank'>Instagram</a></h1>
      <h1><a href="https://saweria.co/StreamHavenOfficial" target='_blank'>Donate</a></h1>
    </div>
  </footer>
  )
}

export default Footer