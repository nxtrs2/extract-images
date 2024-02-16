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
      Promise.all(acceptedFiles.map((file) => uploadFile(file)))
        .then((response) => {
          console.log(response.data.message);
          navigate("/images"); // Navigate after all files are uploaded
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          // Handle the error
        });
    },
    [navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });
  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }} className="text-center">
          <h1>Quick! Extract images from your Excel and Word files!</h1>

          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
