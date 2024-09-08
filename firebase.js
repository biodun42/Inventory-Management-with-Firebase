import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-JsdJ-zYCjpjbY6G9dGdjBsPcnZBqHUI",
  authDomain: "inventory-management-4d9dd.firebaseapp.com",
  projectId: "inventory-management-4d9dd",
  storageBucket: "inventory-management-4d9dd.appspot.com",
  messagingSenderId: "549803702445",
  appId: "1:549803702445:web:eed76cff51b8b650d9ae24",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const colRef = collection(db, "users");
const storage = getStorage(app);

// Function to get logged-in user data
const getLoggedInUser = async (id) => {
  try {
    const q = query(colRef, where("uid", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      console.log("User found: ", user);
      return user;
    } else {
      console.log("No user found");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user: ", error);
  }
};

// Handle user signup
const signUpForm = document.getElementById("signup-form");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const name = target.name.value;
  const email = target.email.value;
  const password = target.password.value;
  const confirmPassword = target.confirmPassword.value;
  const signBtn = target.subtn;

  if (password !== confirmPassword) {
    return Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Password does not match",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  try {
    signBtn.value = "Signing up...";
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await addDoc(colRef, {
      name,
      email,
      uid: res.user.uid,
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Welcome ${name}!`,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location = "dashboard.html";
    });
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    signBtn.value = "Sign Up";
  }
});

// Handle user login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const email = target.emaill.value;
  const password = target.pass.value;
  const loginBtn = target.lgbtn;

  try {
    loginBtn.value = "Logging in...";

    // Sign in the user first
    const res = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = await getLoggedInUser(res.user.uid);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Welcome back ${currentUser.name}`,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      location.href = "dashboard.html";
    });
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: error.message,
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    loginBtn.value = "Log In";
  }
});

const na = document.querySelectorAll(".na");
na.forEach((n) => {
  n.addEventListener("click", () => {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Feature not available",
      showConfirmButton: false,
      timer: 1500,
    });
  });
});


