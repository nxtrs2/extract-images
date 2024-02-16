import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3030/list-images")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  return (
    <div>
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Uploaded Img ${index}`}
          style={{ width: 100, height: 100 }}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
