const socket = io();

const usernamediv = document.getElementById('username');
const roomdiv = document.getElementById('room');
const joinbtn = document.getElementById('join');
const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typingdiv = document.getElementById('typing');

let username = '';
let room = '';

joinbtn.addEventListener('click', () => {
    username = usernamediv.value.trim();
    room = roomdiv.value.trim();

    if (username && room) {
        socket.emit('join chat', { username, room });
        chat.style.display = 'block';
        document.querySelector('.card').style.display = 'none'; // إخفاء كارت التسجيل
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
        socket.emit('chat message', { username, room, message });
        input.value = '';
        socket.emit('stop typing');
    }
});

input.addEventListener('input', () => {
    if (input.value.trim()) {
        socket.emit('typing');
    } else {
        socket.emit('stop typing');
    }
});

socket.on('chat message', ({ username, message,time,date }) => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.innerHTML = `
    <div>
    <strong>${username}:</strong> ${message}
    </div>
    <small class="text-muted">${date} - ${time}</small>
    `;
    item.style.padding='10px'
    item.style.margin='10px'
    item.style.backgroundColor='#ba9570'
    item.style.color='white'
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('typing', (name) => {
    typingdiv.textContent = `${name} is typing...`;

});

socket.on('stop typing', () => {
    typingdiv.textContent = '';
});
