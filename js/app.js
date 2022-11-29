import {
  getNotesFireStore,
  saveNoteFire,
  updateNoteFirestore,
} from "./firestore-functions.js";

let lastVisible = null;

const container = document.querySelector(".notes");
const loading = document.querySelector(".loading");
var myModal = new bootstrap.Modal(document.getElementById("editNote"), {
  keyboard: true,
});

const getAllNotes = async (latestDoc) => {
  const data = await getNotesFireStore(latestDoc);

  data.forEach((doc) => {
    // Create a new note
    const note = document.createElement("div");
    // Add class
    note.setAttribute("data-image", "/images/img.jpg");
    note.setAttribute("data-id", doc.id);
    note.setAttribute("data-content", doc.data().text);
    note.setAttribute("data-bs-toggle", "modal");
    note.setAttribute("data-bs-target", "#editNote");
    // add style
    note.innerHTML = `
       <div class="card my-3" style="cursor: pointer;">
        <div class="card-body">
            <div class="row">
                <div class="col-2">
                    <img src="images/img.jpg" class="img-fluid rounded" alt="Only caché.">
                </div>
                <div class="col">
                    ${doc.data().text}
                </div>
            </div>
        </div>
    </div>
            `;
    // add event listener
    note.addEventListener("click", (e) => {
      const noteToEdit = {};
      noteToEdit.id = note.getAttribute("data-id");
      noteToEdit.content = note.getAttribute("data-content");
      noteToEdit.image = note.getAttribute("data-image");
      setNoteModalValues(noteToEdit);
      // myModal.toggle();
    });
    container.appendChild(note);
  });

  lastVisible = data.docs[data.docs.length - 1];

  if (data.empty) {
    window.removeEventListener("scroll", handleScroll);
    loading.innerHTML = "No hay más notas.";
  }
};

const setNoteModalValues = (note) => {
  console.log("note", note);
  document.getElementById("input-edit-note").value = note.content;
  document.getElementById("editNoteLabel").value = note.title;
  document.getElementById("idNote").value = note.id;
};

const saveNote = async (note) => {
  const result = await saveNoteFire(note);

  if (result === "ok") {
    alert("Note saved");
  } else {
    alert("Error saving note");
  }
};

const updateNote = async (note) => {
  const result = await updateNoteFirestore(note);
  if (result === "ok") {
    console.log("Note updated");
    myModal.hide();
  } else {
    console.log("Error updating note");
  }
};

const btnSaveNote = document.getElementById("btnSaveNote");
btnSaveNote.addEventListener("click", async () => {
  const textNote = document.getElementById("txtNote");
  const note = {
    text: textNote.value,
  };

  await saveNote(note);
  document.location.reload();
});

const cleanNotes = () => {
  container.innerHTML = "";
};


document.getElementById("updateNote").addEventListener("click", (e) => {
  const note = {
    id: document.getElementById("idNote").value,
    text: document.getElementById("input-edit-note").value,
  };
  console.log("app:note", note);
  updateNote(note);
  getAllNotes();
  cleanNotes();
  myModal.hide();
});

// load data on DOM loaded
window.addEventListener("DOMContentLoaded", () => getAllNotes());

const handleScroll = () => {
  if (window.scrollY >= document.body.offsetHeight - window.innerHeight) {
    getAllNotes(lastVisible);
  }
};

window.addEventListener("scroll", handleScroll);
