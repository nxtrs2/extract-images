import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/fileService";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        uploadFile(file)
          .then((response) => {
            console.log("File uploaded successfully", response);
            navigate(`/images?directory=${response.data.directory}`);
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            // Handle the error, such as updating state to show an error message
          });
      });
    },
    [navigate]
  ); // Include navigate in the dependency array

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
  });
  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }} className="text-center">
          <h1>extractimages.io</h1>
          <h4>Quickly Extract Images from Excel, Word and Powerpoint files</h4>

          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop OR click to select files</p>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <span className="small">A Project by S73</span>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
