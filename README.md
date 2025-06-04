# School Management API

A simple Node.js API for managing schools with proximity-based listing.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure database in `.env`:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

3. Create database:

```bash
mysql -u root -p < database_setup.sql
```

4. Start server:

```bash
npm start
```

## API Endpoints

### Add School

```http
POST /api/schools/add
Content-Type: application/json

{
  "name": "School Name",
  "address": "School Address",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

### List Schools by Proximity

```http
GET /api/schools/list?latitude=28.6139&longitude=77.2090
```

Returns schools sorted by distance from the provided coordinates.

## Tech Stack

- Node.js
- Express.js
- MySQL
- dotenv
- Google Cloud SQL
