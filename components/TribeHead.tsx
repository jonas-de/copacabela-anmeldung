import React from 'react';
import { Tribe } from '../utilitites/Tribes';
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';

const TribeHead: React.FC<{ tribe: Tribe }> = ({ tribe }) => (
  <Row className="m-2">
    <Col xs="auto"><Image src={`/images/${tribe.image}`} width={40} height={40} alt={`${tribe.name}-Logo`}/></Col>
    <Col xs="auto" className="align-items-center"><h1><strong>{tribe.name}</strong></h1></Col>
  </Row>
)

export default TribeHead
