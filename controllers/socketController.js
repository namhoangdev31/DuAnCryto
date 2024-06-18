export const handleChatMessage = (io, socket, msg) => {
    console.log('Message from client:', msg);
    io.emit('chat message', msg);
};

// Xử lý sự kiện khi client ngắt kết nối
export const handleDisconnect = () => {
    console.log('User disconnected');
};