import {Button, ButtonGroup} from 'react-bootstrap';
import React from 'react';

const DownloadButton: React.FC = () => (
  <div className="after-dashboard">
    <h4>Download TN-Liste</h4>
    <ButtonGroup>
      <Button variant="primary">
        <a href="/api/download">Alle</a>
      </Button>
      <Button variant="primary">
        <a href="/api/download?state=confirmed">Bestätigte</a>
      </Button>
      <Button variant="primary">
        <a href="/api/download?state=cancelled">Stornierte</a>
      </Button>
    </ButtonGroup>
  </div>
);

export default DownloadButton;
