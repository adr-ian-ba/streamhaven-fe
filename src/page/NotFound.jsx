import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="background-color text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-[6rem] font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>

      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHVlcWs3amd2Y2V1ZGwwMHJydG5ucXB2YjNyNXY5M3gxcGlwY2JibSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iPnLFwV5pPBsc/giphy.gif"
        alt="404 gif"
        className="max-w-[300px] h-auto rounded-lg shadow-lg mb-6"
      />

      <Link to="/" className="bg-primary-color-and-hover text-white px-6 py-2 rounded text-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
