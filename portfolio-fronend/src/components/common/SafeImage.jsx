import React, { useEffect, useState } from 'react';

const SafeImage = ({ src, alt = '', className = '', fallbackLabel = 'Image unavailable', onError, ...props }) => {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) return <div className={`media-fallback ${className}`} role="img" aria-label={alt || fallbackLabel} {...props}><span>{fallbackLabel}</span></div>;
  return <img src={src} alt={alt} className={className} {...props} onError={(event) => { setFailed(true); onError?.(event); }} />;
};

export default SafeImage;
