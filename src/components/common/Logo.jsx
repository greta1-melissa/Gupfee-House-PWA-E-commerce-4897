import React, { useState, useEffect } from 'react';
import { generateFallbackLogo } from '../../utils/logoHelper';

const Logo = ({ size = 'md', className = '', showText = false, textSize = 'base' }) => {
  const [logoSrc, setLogoSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Multiple logo URL formats to try
  const logoUrls = [
    '/gupfee-logo.jpg', // Local uploaded file
    'https://drive.google.com/uc?export=view&id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
    'https://drive.google.com/uc?id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
    'https://lh3.googleusercontent.com/d/11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D',
    'https://drive.google.com/thumbnail?id=11M-8wnlP8RD8DoGW14wMi5RNNCkZup0D&sz=w200',
    '/logo.png' // Final fallback
  ];

  useEffect(() => {
    const tryLoadLogo = async () => {
      for (const url of logoUrls) {
        try {
          // Create a test image to check if URL works
          const testImage = new Image();
          testImage.crossOrigin = 'anonymous';
          
          const imageLoaded = await new Promise((resolve) => {
            testImage.onload = () => resolve(true);
            testImage.onerror = () => resolve(false);
            testImage.src = url;
          });

          if (imageLoaded) {
            setLogoSrc(url);
            setIsLoading(false);
            console.log(`Logo loaded successfully from: ${url}`);
            return;
          }
        } catch (error) {
          console.warn(`Failed to load logo from ${url}:`, error);
        }
      }

      // If all URLs fail, use fallback
      console.warn('All logo URLs failed, using fallback');
      setHasError(true);
      setLogoSrc(generateFallbackLogo('GH', '#0087ff', '#ffffff'));
      setIsLoading(false);
    };

    tryLoadLogo();
  }, []);

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const handleError = () => {
    if (!hasError) {
      console.log('Logo failed to load, switching to fallback');
      setHasError(true);
      setLogoSrc(generateFallbackLogo('GH', '#0087ff', '#ffffff'));
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-brand rounded-lg flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        </div>
        {showText && (
          <div className="ml-3">
            <div className={`${textSizeClasses[textSize]} font-bold text-gray-900 animate-pulse bg-gray-200 rounded h-5 w-24`}></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Gupfee House Logo"
        className={`${sizeClasses[size]} rounded-lg object-contain flex-shrink-0`}
        onError={handleError}
      />
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizeClasses[textSize]} font-bold text-gray-900 leading-tight`}>
            Gupfee House
          </h1>
          <p className={`${textSize === 'xs' ? 'text-xs' : textSize === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500 -mt-1`}>
            Premium Aquarium Supplies
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;