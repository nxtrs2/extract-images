import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const directories = location.state?.directories;

  const handleClose = () => setShow(false);
  const handleShow = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShow(true);
  };

  useEffect(() => {
    if (directories && directories.length > 0) {
      const fetchImages = async () => {
        const allImages = await Promise.all(
          directories.map((dir) =>
            axios
              .get(
                `${process.env.REACT_APP_API_URL}/list-images?directory=${dir}`
              )
              .then((response) => response.data)
              .catch((error) => {
                console.error("Error fetching images:", error);
                return [];
              })
          )
        );
        setImages(allImages.flat());
      };

      fetchImages();
    }
  }, [directories]);

  return (
    <>
      <Container>
        <Row>
          <Col>Click to enlarge</Col>
        </Row>
        <Row>
          {images.map((imageUrl, index) => (
            <Col xs={6} md={4} lg={3} className="mb-4" key={index}>
              <img
                src={process.env.REACT_APP_API_URL + imageUrl}
                alt={`Uploaded Img ${index}`}
                className="img-thumbnail"
                style={{ cursor: "pointer", width: "100%", height: "auto" }}
                onClick={() =>
                  handleShow(process.env.REACT_APP_API_URL + imageUrl)
                }
              />
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            {directories.map((directory, index) => (
              <>
                <a
                  key={index}
                  href={`${process.env.REACT_APP_API_URL}/download/${directory}`}
                >
                  Download Images
                </a>
                <br />
              </>
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="mt-5"
              variant="primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body>
          <img
            src={selectedImage}
            alt="Enlarged pic"
            style={{ width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImageGallery;
