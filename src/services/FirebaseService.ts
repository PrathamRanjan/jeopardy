import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { Category, Question, Group } from '../types';

// Helper to handle errors
const handleError = (error: any, context: string) => {
    console.error(`Firebase Error [${context}]:`, error);
    if (error.code === 'permission-denied') {
        alert("Database Permission Denied! \n\nPlease go to Firebase Console -> Firestore Database -> Rules \nand change 'allow read, write: if false;' to 'if true;'");
    }
    return null;
};

// USERS
export const registerUser = async (username: string, password: string) => {
  try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) return false; // User exists

      await addDoc(usersRef, { username, password });
      return true;
  } catch (e) { return handleError(e, "registerUser") || false; }
};

export const loginUser = async (username: string, password: string) => {
  if (username === "Pratham" && password === "Pratham123") {
      return { username: "Pratham", isAdmin: true };
  }

  try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;
      return { username, isAdmin: false };
  } catch (e) { return handleError(e, "loginUser"); }
};

// ROOMS
export const createRoom = async (name: string, password: string, createdBy: string) => {
  try {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("name", "==", name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) return null; // Room exists

      const docRef = await addDoc(roomsRef, { name, password, createdBy });
      return { id: docRef.id, name, password, categories: [] } as Group;
  } catch (e) { return handleError(e, "createRoom"); }
};

export const joinRoom = async (name: string, password: string) => {
  try {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("name", "==", name), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;
      
      const roomDoc = querySnapshot.docs[0];
      return { id: roomDoc.id, name: roomDoc.data().name, categories: [] } as Group;
  } catch (e) { return handleError(e, "joinRoom"); }
};

// CATEGORIES & QUESTIONS
export const getCategories = async (roomId: string) => {
    try {
        const catsRef = collection(db, "categories");
        // Fetch categories for THIS room
        const q = query(catsRef, where("roomId", "==", roomId));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (e) { return handleError(e, "getCategories") || []; }
};

export const addCategoryToRoom = async (roomId: string, title: string) => {
    try {
        const catsRef = collection(db, "categories");
        const newCat = { roomId, title, questions: [] };
        const docRef = await addDoc(catsRef, newCat);
        return { id: docRef.id, ...newCat } as Category;
    } catch (e) { return handleError(e, "addCategoryToRoom"); }
};

export const addQuestionToCategory = async (catId: string, question: Omit<Question, 'id' | 'isAnswered'>) => {
    try {
        const catRef = doc(db, "categories", catId);
        const catSnap = await getDoc(catRef);
        
        if (catSnap.exists()) {
            const catData = catSnap.data();
            const currentQuestions = catData.questions || [];
            const newQ = { ...question, id: Math.random().toString(36).substr(2, 9), isAnswered: false };
            
            await updateDoc(catRef, {
                questions: [...currentQuestions, newQ]
            });
            return true;
        }
        return false;
    } catch (e) { return handleError(e, "addQuestionToCategory") || false; }
};
