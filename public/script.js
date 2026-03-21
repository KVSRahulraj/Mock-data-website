document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const homeSection = document.getElementById('homeSection');
    const accountSection = document.getElementById('accountSection');
    const ledgerBtn = document.getElementById('ledgerBtn');
    const ledgerSection = document.getElementById('ledgerSection');
    const logo = document.getElementById('logo');

    const homeTableBody = document.getElementById('homeTableBody');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteModal = document.getElementById('noteModal');
    const noteTextarea = document.getElementById('noteTextarea');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    const wordCountSpan = document.getElementById('wordCount');

    let currentPatient = null;

    // Mock Database
    const patients = [
        { name: 'Raj', account: 'H164491646454', amount: '$54', insurance: 'Daltas', notes: [{date: '20/03/2026 10:00:00', text: 'Patient registered.'}] },
        { name: 'Amit', account: 'H999999999', amount: '$20', insurance: 'BlueCross', notes: [] },
        { name: 'Sarah', account: 'H123456789', amount: '$150', insurance: 'Aetna', notes: [] },
        { name: 'John', account: 'H987654321', amount: '$0', insurance: 'Medicare', notes: [] },
        { name: 'Emily', account: 'H555555555', amount: '$300', insurance: 'Cigna', notes: [] }
    ];

    // Render Home Table
    function renderHomeTable() {
        homeTableBody.innerHTML = '';
        patients.forEach((p, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.name}</td><td>${p.account}</td><td>${p.amount}</td><td>${p.insurance}</td><td><button class="see-case-btn" data-index="${index}">See Case</button></td>`;
            homeTableBody.appendChild(tr);
        });

        document.querySelectorAll('.see-case-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                openPatientCase(patients[idx]);
            });
        });
    }
    renderHomeTable();

    // Add Patient Functionality
    addPatientBtn.addEventListener('click', () => {
        const name = document.getElementById('newPatName').value.trim();
        const account = document.getElementById('newPatAcc').value.trim();
        const amount = document.getElementById('newPatAmt').value.trim();
        const insurance = document.getElementById('newPatIns').value.trim();

        if (name && account) {
            patients.push({ name, account, amount: amount || '$0', insurance: insurance || 'N/A', notes: [] });
            renderHomeTable();
            document.getElementById('newPatName').value = '';
            document.getElementById('newPatAcc').value = '';
            document.getElementById('newPatAmt').value = '';
            document.getElementById('newPatIns').value = '';
        } else {
            alert('Please enter at least Patient Name and Account Number.');
        }
    });

    function openPatientCase(patient) {
        currentPatient = patient;
        document.getElementById('infoName').textContent = patient.name;
        document.getElementById('infoAccount').textContent = patient.account;
        document.getElementById('infoAmount').textContent = patient.amount;

        renderNotes();

        homeSection.style.display = 'none';
        accountSection.style.display = 'block';
        ledgerSection.style.display = 'none';
    }

    function renderNotes() {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        if (!currentPatient.notes || currentPatient.notes.length === 0) {
            notesList.innerHTML = '<p>No notes available.</p>';
            return;
        }
        currentPatient.notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-item';
            div.innerHTML = `<strong>${note.date}</strong><br/>${note.text}`;
            notesList.appendChild(div);
        });
    }

    addNoteBtn.addEventListener('click', () => {
        if (!currentPatient) return;
        noteTextarea.value = '';
        wordCountSpan.textContent = '0';
        wordCountSpan.style.color = '#666';
        noteModal.style.display = 'flex';
    });

    noteTextarea.addEventListener('input', () => {
        const text = noteTextarea.value.trim();
        const words = text ? text.split(/\s+/) : [];
        wordCountSpan.textContent = words.length;
        if (words.length > 500) {
            wordCountSpan.style.color = 'red';
        } else {
            wordCountSpan.style.color = '#666';
        }
    });

    saveNoteBtn.addEventListener('click', () => {
        const text = noteTextarea.value.trim();
        const words = text ? text.split(/\s+/) : [];
        
        if (words.length > 500) {
            alert('Note exceeds the 500-word limit. Please shorten your note.');
            return;
        }
        
        if (text !== '') {
            const now = new Date();
            const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            if (!currentPatient.notes) currentPatient.notes = [];
            currentPatient.notes.push({ date: dateStr, text: text });
            renderNotes();
            noteModal.style.display = 'none';
        } else {
            alert('Please enter a note before saving.');
        }
    });

    cancelNoteBtn.addEventListener('click', () => {
        noteModal.style.display = 'none';
    });

    // Search Functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        const foundPatient = patients.find(p => 
            p.name.toLowerCase().includes(query) || 
            p.account.toLowerCase().includes(query)
        );

        if (foundPatient) {
            openPatientCase(foundPatient);
        } else {
            alert('Account or Patient not found.');
        }
    }

    // Ledger Toggle
    ledgerBtn.addEventListener('click', () => {
        if (ledgerSection.style.display === 'none') {
            ledgerSection.style.display = 'block';
        } else {
            ledgerSection.style.display = 'none';
        }
    });

    // Go Home
    logo.addEventListener('click', () => {
        homeSection.style.display = 'block';
        accountSection.style.display = 'none';
        searchInput.value = '';
    });
});

// Global function for inline onclick if needed
window.goHome = function() {
    document.getElementById('homeSection').style.display = 'block';
    document.getElementById('accountSection').style.display = 'none';
    document.getElementById('searchInput').value = '';
};
