import { Badge, Button, Col, Modal, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type NoteProps = {
  onDelete: (id: string) => void;
};

type DeleteModalProps = {
  show: boolean;
  handleClose: () => void;
  onDelete: () => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Link to="..">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onDelete={() => onDelete(note.id)}
      />
    </>
  );
}

function DeleteModal({ show, handleClose, onDelete }: DeleteModalProps) {
  const navigate = useNavigate();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-center my-4">
          Are you sure you want to delete this note?
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onDelete();
              navigate("/");
            }}
          >
            Delete
          </Button>
          <Button
            onClick={handleClose}
            type="button"
            variant="outline-secondary"
          >
            Cancel
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
}
