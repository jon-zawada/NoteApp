import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./NewNote";
import { NoteList } from "./NoteList";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";
import "./styles.css";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

export type NewTag = {
  label: string;
};

function App() {
  const [notes, setNotes] = React.useState<RawNote[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const initApp = () => {
    getNotes();
    getTags();
  };

  React.useEffect(() => {
    initApp();
  }, []);

  const getNotes = () => {
    axios.get("http://localhost:3000/notes").then((res) => {
      setNotes(res.data);
    });
  };

  const getTags = () => {
    axios.get("http://localhost:3000/tags").then((res) => {
      setTags(res.data);
    });
  };

  const notesWithTags = React.useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    axios
      .post("http://localhost:3000/notes", { tags, ...data })
      .then(() => initApp());
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    const tagIds = tags.map((tag: any) => tag.id);
    const payload = { ...data, tagIds, id };
    axios.put("http://localhost:3000/notes", payload).then(() => initApp());
  }

  function onDeleteNote(id: string) {
    axios.delete(`http://localhost:3000/notes/${id}`).then(() => initApp());
  }

  function addTag(tag: NewTag) {
    axios.post("http://localhost:3000/tags", tag).then(() => initApp());
  }

  function updateTag(id: string, label: string) {
    //rework this to be on submit too many calls are made
    axios
      .put("http://localhost:3000/tags", { id, label })
      .then(() => initApp());
  }

  function deleteTag(id: string) {
    axios.delete(`http://localhost:3000/tags/${id}`).then(() => initApp());
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              updateTag={updateTag}
              deleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
