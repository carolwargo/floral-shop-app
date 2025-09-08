const bcrypt = require('bcryptjs');
const hash = '$2b$10$yuBC1kDs/MCIHqoE3k3wguFJUTDh.Xq7xuSC4ojTHSkYDmMp8brt6';
console.log(bcrypt.compareSync('password123', hash));