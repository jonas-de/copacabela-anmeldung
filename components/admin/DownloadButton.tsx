import {Button, ButtonGroup} from 'react-bootstrap';
import React from 'react';

const DownloadButton: React.FC = () => (
  <div className="after-dashboard">
    <h4>Download TN-Liste</h4>
    <div>
      <Button variant="primary">
        <a href="/download">Alle</a>
      </Button>
      <Button variant="primary">
        <a href="/download?state=new">Unbestätigte</a>
      </Button>
      <Button variant="primary">
        <a href="/download?state=confirmed">Bestätigte</a>
      </Button>
      <Button variant="primary">
        <a href="/download?state=cancelled">Stornierte</a>
      </Button>
    </div>
  </div>
);

export default DownloadButton;
