// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeDjTAonhznFv2Yp205xI-9TQ7sKxjc1k",
  authDomain: "my-portfolio-guestbook-79ec7.firebaseapp.com",
  projectId: "my-portfolio-guestbook-79ec7",
  storageBucket: "my-portfolio-guestbook-79ec7.firebasestorage.app",
  messagingSenderId: "389689489024",
  appId: "1:389689489024:web:b2f3a302b7ad5086e31865",
  measurementId: "G-1PXNX4VNHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'guestbook/messages');

// DOM Elements
const guestbookForm = document.getElementById('guestbook-form');
const messagesContainer = document.getElementById('guestbook-messages');

// Debug: Confirm Element Selection
if (!guestbookForm) {
    console.error("Guestbook Error: Form with ID 'guestbook-form' not found!");
} else {
    console.log("Guestbook: Form found and listener attached.");
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper: Format Timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Helper: Create Message Card
function createMessageCard(data) {
    const card = document.createElement('div');
    card.className = 'message-card';
    
    // Handle Anonymous
    const displayName = data.name ? escapeHtml(data.name) : 'Anonymous';
    const displayMessage = escapeHtml(data.message);
    const timeString = formatTimestamp(data.timestamp);

    card.innerHTML = `
        <div class="message-header">
            <span class="message-author">${displayName}</span>
            <span class="message-time">${timeString}</span>
        </div>
        <div class="message-content">${displayMessage}</div>
    `;
    return card;
}

// Event: Handle Form Submission
if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
        // 1. PREVENT DEFAULT (Stops page reload)
        e.preventDefault();
        
        const nameInput = document.getElementById('gb-name');
        const messageInput = document.getElementById('gb-message');
        const submitBtn = guestbookForm.querySelector('button');

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!message) {
            console.warn("Guestbook: Message is empty, aborting.");
            return;
        }

        // Visual Feedback
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Posting...';
        submitBtn.disabled = true;

        // 3. LOGGING (Before Push)
        console.log('Posting...', { name, message });

        // Push to Firebase
        push(messagesRef, {
            name: name,
            message: message,
            timestamp: Date.now()
        }).then(() => {
            // 3. LOGGING (After Success)
            console.log('Success!');
            
            // Reset Form
            guestbookForm.reset();
            submitBtn.innerHTML = 'Success!';
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 2000);
        }).catch((error) => {
            console.error("Error writing to Guestbook: ", error);
            submitBtn.innerHTML = 'Error';
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
}

// Event: Listen for new messages
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const card = createMessageCard(data);
    
    // Prepend to show newest first
    messagesContainer.insertBefore(card, messagesContainer.firstChild);
    
    // Remove loading spinner if present
    const spinner = messagesContainer.querySelector('.loading-spinner');
    if (spinner && spinner.parentNode === messagesContainer) {
        spinner.remove();
    }
});
