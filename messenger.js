// ==========================================
// 1. DYNAMIC CONTACT LIST LOGIC
// ==========================================
const contactsArea = document.querySelector('.contacts-area');

if (contactsArea) {
    const myID = "dan_guevara"; 

    // Listen for friends in your specific Firebase folder
    db.ref(`users/${myID}/friends`).on('child_added', (snapshot) => {
        const friendID = snapshot.key; 
        
        // Fetch the profile details for this specific friend
        db.ref(`users/${friendID}`).once('value', (profileSnapshot) => {
            const profile = profileSnapshot.val();
            
            if (profile) {
                renderContactRow(friendID, profile);
            }
        });
    });
}

// ==========================================
// 2. RENDERING THE CONTACT ROW
// ==========================================
function renderContactRow(id, data) {
    const row = document.createElement('div');
    row.classList.add('contact-row');

    const displayName = data.name || id.replace('_', ' ');

    row.innerHTML = `
        <div class="avatar-container">
            <div class="avatar-lg">👤</div>
        </div>
        <div class="contact-info">
            <div class="name-row">
                <h2>${displayName} <span class="verify-check">✔</span></h2>
            </div>
            <p>${data.location || 'Batangas'}</p>
            <span class="role-label">${data.role || 'Member'}</span>
        </div>
    `;

    // FIX: Using './chats.html' to match your filename with the 's'
    row.onclick = () => {
        window.location.href = `./chats.html?me=dan_guevara&with=${id}`;
    };

    contactsArea.appendChild(row);
}