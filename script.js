const MAX_LENGTH = 200;
const noteInput = document.querySelector("#note-input");
const addNoteButton = document.querySelector("#add-note");
const clearNotesButton = document.querySelector("#clear-notes");
const notesList = document.querySelector("#notes-list");
const emptyState = document.querySelector("#empty-state");
const charCount = document.querySelector("#char-count");

const storageKey = "simple-notes";

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const saveNotes = (notes) => {
  localStorage.setItem(storageKey, JSON.stringify(notes));
};

let notes = loadNotes();

const updateEmptyState = () => {
  emptyState.style.display = notes.length === 0 ? "block" : "none";
  clearNotesButton.disabled = notes.length === 0;
};

const renderNotes = () => {
  notesList.innerHTML = "";

  notes.forEach((note) => {
    const listItem = document.createElement("li");
    listItem.className = "note";

    const meta = document.createElement("div");
    meta.className = "note__meta";

    const dateText = document.createElement("span");
    dateText.textContent = formatDate(note.createdAt);

    const lengthText = document.createElement("span");
    lengthText.textContent = `${note.text.length} символов`;

    meta.append(dateText, lengthText);

    const text = document.createElement("p");
    text.className = "note__text";
    text.textContent = note.text;

    const actions = document.createElement("div");
    actions.className = "note__actions";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "secondary";
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes(notes);
      renderNotes();
      updateEmptyState();
    });

    actions.append(deleteButton);

    listItem.append(meta, text, actions);
    notesList.append(listItem);
  });
};

const updateCharCount = () => {
  const length = noteInput.value.length;
  charCount.textContent = `${length} / ${MAX_LENGTH}`;
  charCount.style.color = length > MAX_LENGTH ? "#e11d48" : "#5c6a86";
};

addNoteButton.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) {
    noteInput.focus();
    return;
  }

  const trimmedText = text.slice(0, MAX_LENGTH);

  const newNote = {
    id: crypto.randomUUID(),
    text: trimmedText,
    createdAt: Date.now(),
  };

  notes = [newNote, ...notes];
  saveNotes(notes);
  renderNotes();
  updateEmptyState();

  noteInput.value = "";
  updateCharCount();
  noteInput.focus();
});

clearNotesButton.addEventListener("click", () => {
  if (!notes.length) {
    return;
  }

  notes = [];
  saveNotes(notes);
  renderNotes();
  updateEmptyState();
});

noteInput.addEventListener("input", updateCharCount);

renderNotes();
updateEmptyState();
updateCharCount();
