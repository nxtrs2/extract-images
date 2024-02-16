// Initialize the shared array
const savedImages = [];

// Export functions to interact with the array
module.exports = {
  addImage: (imageName) => savedImages.push(imageName),
  getImages: () => savedImages,
};
