/* THIS IS NOT USED - DELETE LATER */
const savedImages = [];

// Export functions to interact with the array
module.exports = {
  addImage: (imageName) => savedImages.push(imageName),
  getImages: () => savedImages,
};
