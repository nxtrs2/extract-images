import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/fileService";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Drag 'n' drop OR click to select files"
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMessage("Processing files...");
      const uploadPromises = acceptedFiles.map((file) => uploadFile(file));

      Promise.all(uploadPromises)
        .then((responses) => {
          const directories = responses.map(
            (response) => response.data.directory
          );
          navigate(`/images`, { state: { directories } });
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        })
        .finally(() => {
          setTimeout(
            () => setMessage("Drag 'n' drop OR click to select files"),
            5000
          );
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
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/x-iwork-pages-sffpages": [".pages"],
      "application/x-iwork-numbers-sffnumbers": [".numbers"],
      "application/x-iwork-keynote-sffkey": [".key"],
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
            {isDragActive ? <p>Drop the files here ...</p> : <p>{message}</p>}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <span className="small">V 0.2 B</span>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
