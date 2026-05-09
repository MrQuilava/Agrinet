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

// Navigate to Messenger
document.getElementById('btn-messenger').onclick = () => {
    window.location.href = "messenger.html";
};

// Load Location
db.ref('users/dan_guevara').on('value', (snap) => {
    if(snap.val()) document.getElementById('display-location').innerText = snap.val().location;
});

// Load Market Prices
db.ref('marketPrices').on('value', (snap) => {
    const data = snap.val();
    if(data) {
        document.getElementById('price-date').innerText = data.dateUpdated;
        let rowsHtml = '';
        data.commodities.forEach(c => {
            rowsHtml += `<div class="price-item">
                <span>${c.name}</span><span>${c.specification}</span><span>${c.unit}</span><span>${c.weeklyAvg}</span>
            </div>`;
        });
        document.getElementById('price-rows').innerHTML = rowsHtml;
    }
});

// Load Posts
db.ref('posts').on('child_added', (snap) => {
    const post = snap.val();
    db.ref(`users/${post.userID}`).once('value', (uSnap) => {
        const user = uSnap.val();
        renderPost(post, user);
    });
});

function renderPost(post, user) {
    const feed = document.getElementById('home-feed');
    const div = document.createElement('div');
    div.style.padding = "15px";
    div.style.borderBottom = "1px solid rgba(163,224,161,0.1)";
    div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; color:white;">
            <div style="font-size:20px;">👤</div>
            <div><b>${user.name}</b> • Follow<br><small>2h • 🌐</small></div>
        </div>
        <h3 style="color:#a3e0a1; text-transform:uppercase; margin:10px 0 5px;">${post.headline}</h3>
        <p style="color:white; font-size:12px; margin-bottom:10px;">${post.description}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
            ${post.images ? post.images.map(img => `<img src="${img}" style="width:100%; height:100px; object-fit:cover; border-radius:5px;">`).join('') : ''}
        </div>
    `;
    feed.prepend(div);
}