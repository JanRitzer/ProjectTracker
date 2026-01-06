import { useState, useRef, useEffect } from 'react';
import { formatTimestamp } from '../utils/helpers';
import styles from './QuickNotes.module.css';

export function QuickNotes({ notes, onAddNote, onDeleteNote }) {
  const [noteInput, setNoteInput] = useState('');
  const notesEndRef = useRef(null);

  const scrollToBottom = () => {
    notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!noteInput.trim()) {
      return;
    }

    onAddNote(noteInput.trim());
    setNoteInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Notes</h2>
        <span className={styles.count}>{notes.length}</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.addForm}>
        <textarea
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a quick note..."
          className={styles.input}
          rows={3}
        />
        <button type="submit" className={styles.addBtn} disabled={!noteInput.trim()}>
          Add Note
        </button>
      </form>

      <div className={styles.notesList}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>No notes yet</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={styles.note}>
              <div className={styles.noteHeader}>
                <span className={styles.timestamp}>{formatTimestamp(note.createdAt)}</span>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className={styles.deleteBtn}
                  aria-label="Delete note"
                >
                  ×
                </button>
              </div>
              <p className={styles.noteContent}>{note.content}</p>
            </div>
          ))
        )}
        <div ref={notesEndRef} />
      </div>
    </div>
  );
}
