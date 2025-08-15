import React, { useState, useEffect, useCallback } from "react";
import TicketPanel from "../ticket/TicketPanel";

interface ResolutionSectionProps {
  title: string;
  steps: string[];
  question: string;
  imageSrc?: string;
  htmlContent?: string | null;  
}

const ResolutionSection: React.FC<ResolutionSectionProps> = ({
  title,
  steps,
  question,
  imageSrc,
  htmlContent, 
}) => {
  const [showTicketModal, setShowTicketModal] = useState(false);

  const toggleTicketModal = useCallback(() => {
    setShowTicketModal((prev) => !prev);
  }, []); 
  useEffect(() => {
    if (!htmlContent) return;

    console.log("ResolutionSection htmlContent:", htmlContent);
    
    const imgTags = htmlContent.match(/<img[^>]*>/g);
    if (!imgTags) {
      console.log("No image tags found in htmlContent");
      return;
    }

    console.log("Found image tags:", imgTags);
    
    imgTags.forEach((imgTag, index) => {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
      if (!srcMatch) return;

      const imageUrl = srcMatch[1];
      console.log(`Image ${index + 1} src:`, imageUrl);
      
      const testImg = new Image();
      testImg.onload = () => {
        console.log(`Image ${index + 1} loaded successfully:`, imageUrl);
      };
      testImg.onerror = (error) => {
        console.error(`Image ${index + 1} failed to load:`, imageUrl, error);
      };
      testImg.src = imageUrl;
    });
  }, [htmlContent]);
 
  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      console.log('Image loaded successfully:', target.src);
    }
  }, []);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      console.error('Image failed to load:', target.src);
    }
  }, []);
 
  const formatSteps = useCallback((stepText: string) => {
    return stepText.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < stepText.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  }, []);

  return (
    <div className="bg-white text-white rounded-lg shadow-md p-4 cardMain mb-6">
      <div className="golden-gradient">
        <h3 className="text-lg font-medium mb-3">{title}</h3>

        {htmlContent ? (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: htmlContent.includes('<br') || htmlContent.includes('<p') 
                ? htmlContent 
                : htmlContent.replace(/\\n/g, '<br />').replace(/\n/g, '<br />') 
            }}
            style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'  // This helps preserve formatting
            }}
            className="solution-content leading-relaxed"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {steps.map((step, index) => (
                <p key={index} className="leading-relaxed">
                  {formatSteps(step)}
                </p>
              ))}
            </div>

            {question && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">
                  {formatSteps(question)}
                </h4>
              </div>
            )}
          </>
        )}
      </div>
      
      {imageSrc && !htmlContent && (
        <div className="mt-4">
          <img
            src={imageSrc}
            width="35%"
            alt="Resolution Image"
            className="rounded-md mb-4 object-cover max-w-full h-auto"
            onLoad={() => console.log('Static image loaded:', imageSrc)}
            onError={() => console.error('Static image failed to load:', imageSrc)}
          />
        </div>
      )}
 
      {showTicketModal && (
        <TicketPanel 
          onClose={toggleTicketModal} 
        />
      )}
    </div>
  );
};

export default ResolutionSection;