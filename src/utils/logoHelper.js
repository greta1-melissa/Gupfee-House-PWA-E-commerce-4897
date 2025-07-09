/**
 * Helper function to generate a fallback logo when the main logo is unavailable
 * @param {string} text - Text to display in the logo (e.g. "GH" for Gupfee House)
 * @param {string} bgColor - Background color in hex format
 * @param {string} textColor - Text color in hex format
 * @returns {string} - Data URL for the generated logo
 */
export const generateFallbackLogo = (text = "GH", bgColor = "#0d90ae", textColor = "#ffffff") => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  // Draw background with gradient
  const gradient = ctx.createLinearGradient(0, 0, 200, 200);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, '#0ea5e9'); // Light blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some design elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(150, 150, 40, 0, 2 * Math.PI);
  ctx.fill();

  // Draw text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 80px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Add a subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Convert to data URL
  return canvas.toDataURL('image/png');
};

/**
 * Get the logo URL with a fallback if the main logo fails to load
 * @returns {string} - Logo URL
 */
export const getLogoUrl = () => {
  const logoUrl = '/logo.png';
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const img = new Image();
    img.src = logoUrl;
    
    // If the image fails to load, generate a fallback
    img.onerror = () => {
      console.warn('Logo failed to load, using fallback');
      return generateFallbackLogo();
    };
  }
  
  return logoUrl;
};

/**
 * Test if a URL is accessible
 * @param {string} url - URL to test
 * @returns {Promise<boolean>} - Whether the URL is accessible
 */
export const testImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Create a fish-themed logo fallback
 * @param {string} bgColor - Background color
 * @param {string} accentColor - Accent color
 * @returns {string} - Data URL for the fish logo
 */
export const generateFishLogo = (bgColor = "#0d90ae", accentColor = "#f97316") => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, '#0a7a95');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw fish silhouette
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  // Fish body (ellipse)
  ctx.ellipse(100, 100, 60, 35, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Fish tail
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(20, 80);
  ctx.lineTo(20, 120);
  ctx.closePath();
  ctx.fill();

  // Fish eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(120, 90, 8, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(122, 88, 3, 0, 2 * Math.PI);
  ctx.fill();

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GUPFEE', 100, 160);
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText('HOUSE', 100, 180);

  return canvas.toDataURL('image/png');
};

/**
 * Advanced logo loading with retry mechanism
 * @param {string[]} urls - Array of URLs to try
 * @param {number} maxRetries - Maximum number of retries per URL
 * @returns {Promise<string>} - Working logo URL or fallback
 */
export const loadLogoWithRetry = async (urls, maxRetries = 3) => {
  for (const url of urls) {
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          console.log(`Logo loaded successfully from: ${url} (attempt ${retry + 1})`);
          return url;
        }
      } catch (error) {
        console.warn(`Failed to load logo from ${url} (attempt ${retry + 1}):`, error);
        
        // Wait before retry
        if (retry < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        }
      }
    }
  }
  
  console.warn('All logo URLs failed after retries, using fallback');
  return generateFallbackLogo('GH', '#0d90ae', '#ffffff');
};