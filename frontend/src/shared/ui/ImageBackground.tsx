import React from "react";

interface ImageBackgroundProps {
  imageUrl?: string | null;
  defaultImage: string;
  backendUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({
  imageUrl,
  defaultImage,
  backendUrl = import.meta.env.VITE_API_URL,
  className,
  style,
  children,
}) => {
  const getUrl = () => {
    if (!imageUrl) return defaultImage;
    if (imageUrl.startsWith("http")) return imageUrl;
    return backendUrl + imageUrl;
  };
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${getUrl()})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ImageBackground;