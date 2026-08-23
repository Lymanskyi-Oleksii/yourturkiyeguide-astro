import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js';

const firebaseConfig = {
    apiKey: "AIzaSyASoIqknT0hMi7QTsKS_nBJbDvC9aWbcW0",
    authDomain: "reviews-project-travels-turkey.firebaseapp.com",
    projectId: "reviews-project-travels-turkey",
    storageBucket: "reviews-project-travels-turkey.firebasestorage.app",
    messagingSenderId: "695056378421",
    appId: "1:695056378421:web:863f7533509fdf791bdf7c"
};

export const app = initializeApp(firebaseConfig);

export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfGtJQtAAAAAGA8QjtHMuND-eGhoIWAdg2ppk70'),
    isTokenAutoRefreshEnabled: true
});

export const db = getFirestore(app);
export const auth = getAuth(app);