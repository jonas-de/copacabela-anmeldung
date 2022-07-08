import React, {ReactNode} from 'react';
import {Col, Row} from 'react-bootstrap';
import Image from 'next/image';

const ImageHead: React.FC<{
  image: string;
  text: string;
  children?: ReactNode;
}> = ({image, text, children}) => (
  <Row className="m-2">
    <Col xs="auto">
      <Image
        src={`/images/${image}`}
        width={40}
        height={40}
        alt={`${text}-Logo`}
      />
    </Col>
    <Col xs="auto" className="align-items-center">
      <h1>
        <strong>{text}</strong>
      </h1>
    </Col>
    <Col xs="auto">{children}</Col>
  </Row>
);

export default ImageHead;
