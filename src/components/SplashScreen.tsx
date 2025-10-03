import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import logo from "../assets/logo.jpeg"

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalTime = 30; // update every 30ms
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          onFinish();
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <img
        src={logo}
        alt="Logo"
        className="w-40 h-40 mb-8"
      />
      <div className="w-64">
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default SplashScreen;
