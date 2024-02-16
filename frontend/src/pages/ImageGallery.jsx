import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const directory = urlParams.get("directory");

  const handleClose = () => setShow(false);
  const handleShow = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShow(true);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3030/list-images?directory=${directory}`)
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

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
                src={imageUrl}
                alt={`Uploaded Img ${index}`}
                className="img-thumbnail"
                style={{ cursor: "pointer", width: "100%", height: "auto" }}
                onClick={() => handleShow(imageUrl)}
              />
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <a href={`http://localhost:3030/download/${directory}`}>
              Download Images
            </a>
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
