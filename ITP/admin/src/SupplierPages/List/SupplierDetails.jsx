import React from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

const SupplierDetails = ({ supplier, onHide }) => {
  return (
    <Modal show={true} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Supplier Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col md={1}>
              <FaUser />
            </Col>
            <Col md={11}>
              <strong>Name:</strong> {supplier.name}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={1}>
              <FaEnvelope />
            </Col>
            <Col md={11}>
              <strong>Email:</strong> {supplier.email}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={1}>
              <FaMapMarkerAlt />
            </Col>
            <Col md={11}>
              <strong>Address:</strong> {supplier.address}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={1}>
              <FaPhone />
            </Col>
            <Col md={11}>
              <strong>Phone:</strong> {supplier.phone}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={1}>
              <FaRegClock />
            </Col>
            <Col md={11}>
              <strong>Registration Date:</strong>{" "}
              {new Date(supplier.registrationDate).toLocaleDateString()}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={1}>
              <FaRegClock />
            </Col>
            <Col md={11}>
              <strong>Updated Date:</strong>{" "}
              {new Date(supplier.updatedDate).toLocaleDateString()}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierDetails;
