import React, { useState } from 'react';

const ImageCustom = ({ src }) => {
    const [imageError, setImageError] = useState(false);
    const onImageError = () => {
        setImageError(true);
    };
    return (
        <img
            src={imageError ? require('../../assets/images/01-3.jpg') : src}
            alt={src}
            onError={() => onImageError()}
        />
    );
};

export default ImageCustom;
