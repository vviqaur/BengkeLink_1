
import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-primary to-orange-dark flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-logo-spin mb-8">
          <img 
            src="/lovable-uploads/18c3e59c-93d8-4fb1-b29d-ad8245a52f1b.png" 
            alt="BengkeLink Logo" 
            className="w-32 h-32 mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">BengkeLink</h1>
        <p className="text-white/90 text-lg mb-8">Platform Bengkel Digital Terpercaya</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
