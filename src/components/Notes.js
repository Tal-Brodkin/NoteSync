import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Modal, Button, Form, Collapse, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [noteHistory, setNoteHistory] = useState({});
  const [openHistoryId, setOpenHistoryId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToRevert, setNoteToRevert] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading

  const navigate = useNavigate(); // Navigate hook for routing

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const notesList = snapshot.docs.map((doc, index) => ({ id: doc.id, ...doc.data(), noteNumber: index + 1 }));
      setNotes(notesList.reverse());
    });
    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const user = auth.currentUser;
      setLoading(true); // Start loading
      await addDoc(collection(db, 'notes'), {
        content: newNote,
        createdBy: user.email || 'Anonymous',
        contentHistory: [newNote] // Initialize history with the first version
      });
      setNewNote('');
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteNote = async (id) => {
    setLoading(true); // Start loading
    await deleteDoc(doc(db, 'notes', id));
    setLoading(false); // Stop loading
  };

  const handleUpdateNote = async (id, content) => {
    setEditNoteId(id);
    setEditNoteContent(content);
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    if (editNoteContent.trim()) {
      const user = auth.currentUser;
      const noteRef = doc(db, 'notes', editNoteId);
      const noteDoc = await getDoc(noteRef);
      const noteData = noteDoc.data();
      const updatedHistory = [...noteData.contentHistory, editNoteContent];
      setLoading(true); // Start loading
      await updateDoc(noteRef, {
        content: editNoteContent,
        contentHistory: updatedHistory,
        editedBy: user.email // Store the editor's email
      });
      setShowModal(false);
      setLoading(false); // Stop loading
    }
  };

  const handleToggleHistory = (id) => {
    if (openHistoryId === id) {
      setOpenHistoryId(null);
    } else {
      setOpenHistoryId(id);
      const noteRef = doc(db, 'notes', id);
      getDoc(noteRef).then(noteDoc => {
        const noteData = noteDoc.data();
        const history = noteData.contentHistory.slice(0, -1);
        setNoteHistory({ ...noteHistory, [id]: history });
      });
    }
  };

  const handleRevertNote = (noteId, historyContent) => {
    setNoteToRevert({ noteId, historyContent });
    setShowConfirmModal(true);
  };

  const confirmRevertNote = async () => {
    if (noteToRevert) {
      const user = auth.currentUser;
      const noteRef = doc(db, 'notes', noteToRevert.noteId);
      const noteDoc = await getDoc(noteRef);
      const noteData = noteDoc.data();
      const updatedHistory = [...noteData.contentHistory, noteToRevert.historyContent];
      setLoading(true); // Start loading
      await updateDoc(noteRef, {
        content: noteToRevert.historyContent,
        contentHistory: updatedHistory,
        editedBy: user.email // Update the "Edited by" field
      });
      setShowConfirmModal(false);
      setNoteToRevert(null);
      setLoading(false); // Stop loading
    }
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Notes</h1>
          <div className="mb-4 text-center">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="New note"
              />
              <button onClick={handleAddNote} className="btn btn-primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Add Note'}
              </button>
            </div>
          </div>
          <div className="row">
            {notes.map((note, index) => (
              <div key={note.id} className={`col-md-6 mb-3 ${index % 2 === 0 ? 'pe-md-2' : 'ps-md-2'}`}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Note #{note.noteNumber}</h5>
                    <p className="card-text">{note.content}</p>
                    <p className="card-text text-muted"><small>Created by: {note.createdBy}</small></p>
                    {note.editedBy && <p className="card-text text-muted"><small>Edited last by: {note.editedBy}</small></p>}
                    <div className="d-flex justify-content-between">
                      <button onClick={() => handleUpdateNote(note.id, note.content)} className="btn btn-warning me-2" disabled={loading}>Edit</button>
                      <button onClick={() => handleDeleteNote(note.id)} className="btn btn-danger me-2" disabled={loading}>Delete</button>
                      <Button
                        onClick={() => handleToggleHistory(note.id)}
                        aria-controls={`history-collapse-${note.id}`}
                        aria-expanded={openHistoryId === note.id}
                        className="btn btn-info"
                      >
                        {openHistoryId === note.id ? 'Hide History' : 'Show History'}
                      </Button>
                    </div>
                    <Collapse in={openHistoryId === note.id}>
                      <div id={`history-collapse-${note.id}`} className="mt-2">
                        <br/>
                        <h6>Previous Versions:</h6>
                        {noteHistory[note.id]?.map((historyContent, index) => (
                          <div
                            key={index}
                            className="card mb-2 history-item"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRevertNote(note.id, historyContent)}
                          >
                            <div className="card-body">
                              <p className="card-text">{historyContent}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="danger" onClick={handleLogout} disabled={loading}>Logout</Button>
          </div>
        </div>
      </div>

      {/* Modal for editing notes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNoteContent">
              <Form.Control
                as="textarea"
                rows={3}
                value={editNoteContent}
                onChange={(e) => setEditNoteContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Reverting Notes */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Revert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to revert to this previous version of the note?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmRevertNote}>
            Yes, Revert
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Notes;