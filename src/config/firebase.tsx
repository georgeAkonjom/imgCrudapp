// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBTcqmqipHtPOI9ynJ6LhvZlrDDZOn18Q8",
	authDomain: "imageuploadcrud.firebaseapp.com",
	projectId: "imageuploadcrud",
	storageBucket: "imageuploadcrud.appspot.com",
	messagingSenderId: "66659196817",
	appId: "1:66659196817:web:ca3e890cf4e6d93c2dc430",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
