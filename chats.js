const firebaseConfig = {
    apiKey: "AIzaSyDoCTfHXT4dgVj-u5Ybq9aYXbbM0YFPs6U",
    authDomain: "agrinet-chatsection.firebaseapp.com",
    databaseURL: "https://agrinet-chatsection-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "agrinet-chatsection",
    storageBucket: "agrinet-chatsection.firebasestorage.app",
    messagingSenderId: "912693187236",
    appId: "1:912693187236:web:5e404a64985f57f3d28c31"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const chatDisplay = document.getElementById('chatDisplay');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const partnerNameHeading = document.getElementById('chatPartnerName');

const urlParams = new URLSearchParams(window.location.search);
const myID = urlParams.get('me') || "dan_guevara"; 
const friendID = urlParams.get('with'); 

if (friendID) {
    partnerNameHeading.innerText = friendID.replace('_', ' ');
    const chatID = [myID, friendID].sort().join('_and_');
    const chatPath = `chats/${chatID}`;

    sendBtn.onclick = () => {
        const text = userInput.value;
        if (text.trim() !== "") {
            db.ref(chatPath).push({
                sender: myID,
                message: text,
                time: Date.now()
            });
            userInput.value = "";
        }
    };

    db.ref(chatPath).on('child_added', (snapshot) => {
        const data = snapshot.val();
        const isMe = data.sender === myID;
        const msgRow = document.createElement('div');
        msgRow.classList.add('msg-row', isMe ? 'sent' : 'received');
        msgRow.innerHTML = `<div class="bubble">${data.message}</div>`;
        chatDisplay.appendChild(msgRow);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });
}