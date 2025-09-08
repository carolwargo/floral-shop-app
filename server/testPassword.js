const bcrypt = require('bcryptjs');
const hashedPassword = '$2b$10$yuBC1kDs/MCIHqoE3k3wguFJUTDh.Xq7xuSC4ojTHSkYDmMp8brt6';
bcrypt.compare('password123', hashedPassword, (err, isMatch) => {
  console.log('Password match:', isMatch); // Should log true if correct
});