/**
 * Uploads a file to the server.
 * @param {File} file - The file to upload.
 * @returns {Promise} - A promise that resolves with the server response.
 */
import axios from "axios";

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { uploadFile };
