import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Papa, { ParseResult } from 'papaparse';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: ParseResult<any>) => {
          onFileUpload(results.data);
        },
        error: (err: Error) => {
          setError(err.message);
        }
      });
    } else {
      setError('Please select a file to upload.');
    }
  };

  return (
    <div>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload CSV File</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Button onClick={handleUpload}>Upload</Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default FileUpload;