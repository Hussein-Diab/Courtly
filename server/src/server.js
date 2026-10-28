const { port, jwt } = require('./config/env');
const app = require('./app');

if (!jwt.secret) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}
app.listen(port, () => console.log(`Courtly running on http://localhost:${port}`));
