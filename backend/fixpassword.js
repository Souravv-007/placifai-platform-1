const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, 
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
);

async function fix() {
  const hash = await bcrypt.hash('test123', 10);
  console.log('Generated hash:', hash);
  
  await s.query(
    'UPDATE "Users" SET password=:hash WHERE email=:email',
    { replacements: { hash, email: 'sanketadak55@gmail.com' } }
  );
  
  console.log('Password updated successfully!');
  
  // Verify
  const [users] = await s.query('SELECT password FROM "Users" WHERE email=\'sanketadak55@gmail.com\'');
  const match = await bcrypt.compare('test123', users[0].password);
  console.log('Verification match:', match);
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });