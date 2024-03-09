import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/fileService";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../HomePage.css";

const acceptedFileTypes = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/x-iwork-pages-sffpages": [".pages"],
  "application/x-iwork-numbers-sffnumbers": [".numbers"],
  "application/x-iwork-keynote-sffkey": [".key"],
};

const HomePage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Drag 'n' drop OR click to select files"
  );

  const onDropAccepted = useCallback(
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

  const onDropRejected = useCallback((fileRejections) => {
    setMessage(
      "Error: Wrong file type! Please check file types and size (max 5MB)."
    );
    setTimeout(
      () => setMessage("Drag 'n' drop OR click to select files"),
      5000
    );
  }, []);

  const validator = (file) => {
    if (file.size > 5242880) {
      // 5MB in bytes
      return {
        code: "file-too-large",
        message: "File is larger than 5MB",
      };
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    validator,
    accept: acceptedFileTypes,
    maxFiles: 1,
    multiple: false,
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
          <span className="small">V 0.0.3 b - </span>

          <span className="small">
            <a href="https://github.com/nxtrs2/extract-images">Github</a>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
