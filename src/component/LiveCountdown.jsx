import { useState } from "react";
import { useEffect } from "react";

const LiveCountdown = ({ expiresIn }) => {
  const [remaining, setRemaining] = useState(expiresIn);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return (
    <p className="text-yellow-400 text-xs mt-1">
      ⏳ Account will be auto-deleted in:{" "}
      <span className="font-semibold">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </p>
  );
};

export default LiveCountdown