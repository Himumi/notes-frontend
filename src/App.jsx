import { useState, useEffect } from "react";
import Note from "./components/Note.jsx";
import noteService from './sevices/notes.js';
import Notification from './components/Notification.jsx';
import './index.css';

const Form = ({ onSubmit, onChange, defaultValue, buttonValue }) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={defaultValue} onChange={onChange} />
        <button type="submit">{buttonValue}</button>
      </form>
    </>
  );
};

const Display = ({ noteData, toggleFunc }) => {
  return (
    <>

      <ul>
        {noteData.map((note) => (
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleFunc(note.id)} 
          />
        ))}
      </ul>
    </>
  );
};

const ButtonImportant = ({ showAllValue, switchShowAll }) => {
  return (
    <div>
      <button onClick={switchShowAll}>
        show {showAllValue ? "important" : "all"}
      </button>
    </div>
  );
};
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errMessage, setErrMessage] = useState(null);


  useEffect(() => {
    console.log('use effect');

    noteService
      .getAll().then(initNotes => {
        console.log('fetching fulfilled by module');
        setNotes(initNotes);
      });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    };
    
    noteService
      .create(noteObject).then(returnedNote => {
        console.log(returnedNote);
        setNotes(notes.concat(returnedNote));
        setNewNote('');
        });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled' );

    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };
    
    noteService
      .update(id, changedNote).then(returnedNote => {
				console.log('notes have been updated by module');
        setNotes(notes.map(n => n.id !== id ? n : returnedNote));
      })
      .catch(error => {
        setErrMessage(`the note '${note.content} was already deleted from server'`);
        setTimeout(() => setErrMessage(null), 3000);
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);
  const switchImportance = () => setShowAll(!showAll);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errMessage} />
      <ButtonImportant 
        showAllValue={showAll}
        switchShowAll={switchImportance}
      />
      <Display
        noteData={notesToShow}
        toggleFunc={toggleImportanceOf}
      />

      <Form 
        onSubmit={addNote}
        onChange={handleNoteChange}
				defaultValue={newNote}
        buttonValue='Add'
      />
      <Footer />
    </div>
  );
};

export default App;
