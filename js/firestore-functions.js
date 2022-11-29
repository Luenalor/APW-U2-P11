import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getFirestore,
  limit,
  startAfter
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { app } from "/js/firestore.js";

console.log("firestore-functions.js entro");

const db = getFirestore(app);

const getNotesFireStore = async (latestDoc) => {
  let q = null;
  if (latestDoc) {
    q = query(collection(db, "notes"), 
    orderBy("create_at", "desc"),
    startAfter(latestDoc),
    limit(4)
    );
  } else {
    q = query(collection(db, "notes"), 
    orderBy("create_at", "desc"),
    limit(4)
    );
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

const saveNoteFire = async (note) => {
  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "notes"), {
    text: note.text,
    create_at: new Date(),
  });

  if (docRef) {
    return "ok";
    console.log("Document written with ID: ", docRef.id);
  } else {
    return "error";
    console.log("Error adding document: ", error);
  }
};


const updateNoteFirestore = async (note) => {
  // update a document with a generated id.
  const noteRef = doc(db, "notes", note.id);

  if (noteRef) {
    await updateDoc(noteRef, {
      text: note.text,
    });
    return "ok";
  }
  return "fail";
};

export { getNotesFireStore, saveNoteFire, updateNoteFirestore };
