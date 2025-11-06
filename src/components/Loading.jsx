import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';
import loaderAnimation from '../assets/loader.json';
import './Loading.scss';

export default function Loading() {
  const [showText, setShowText] = useState(false);
  const [canHide, setCanHide] = useState(false);
  const MINIMUM_DURATION = 5000; // 5 seconds

  useEffect(() => {
    // Set minimum duration timer
    const minDurationTimer = setTimeout(() => {
      setCanHide(true);
    }, MINIMUM_DURATION);

    // Show text after a short delay to ensure animation is visible
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    return () => {
      clearTimeout(minDurationTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="animation-container">
          <Lottie
            animationData={loaderAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
        <div className={`text-container ${showText ? 'visible' : ''}`}>
          <p className="loading-text">Loading Our Expenses</p>
        </div>
      </div>
    </div>
  );
}