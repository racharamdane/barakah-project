# Barakah 🛍️ — Algeria's Anti-Food-Waste Marketplace

A Too Good To Go-inspired web application for Algeria, connecting restaurants with customers through discounted end-of-day surprise bags.

---

## Project Structure

```
barakah/
├── README.md
├── frontend/                          # React SPA
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js                   # Entry point
│       ├── App.js                     # Router & auth guard
│       ├── context/
│       │   └── AuthContext.js         # Global auth state
│       ├── utils/
│       │   └── api.js                 # Axios instance + helpers
│       ├── styles/
│       │   └── globals.css            # Design tokens & resets
│       ├── components/
│       │   ├── shared/
│       │   │   ├── Navbar.jsx         # Top nav (customer & restaurant variants)
│       │   │   ├── BagCard.jsx        # Reusable offer card
│       │   │   └── LoadingSpinner.jsx
│       │   ├── auth/
│       │   │   ├── CustomerRegister.jsx
│       │   │   ├── CustomerLogin.jsx
│       │   │   ├── RestaurantRegister.jsx
│       │   │   └── RestaurantLogin.jsx
│       │   ├── customer/
│       │   │   ├── BagGrid.jsx        # Grid of available bags
│       │   │   ├── FilterBar.jsx      # City / price filters
│       │   │   └── BagDetail.jsx      # Expanded bag modal
│       │   └── restaurant/
│       │       ├── OfferForm.jsx      # Create / edit offer
│       │       └── OfferList.jsx      # Restaurant's active offers
│       └── pages/
│           ├── LandingPage.jsx        # Public home
│           ├── customer/
│           │   ├── RegisterPage.jsx
│           │   ├── LoginPage.jsx
│           │   └── DashboardPage.jsx  # Main feed
│           └── restaurant/
│               ├── RegisterPage.jsx
│               ├── LoginPage.jsx
│               └── DashboardPage.jsx  # Offer management
│
└── backend/                           # Node.js + Express API
    ├── package.json
    ├── server.js                      # Entry point
    ├── .env.example
    ├── db/
    │   ├── schema.sql                 # Full DB schema
    │   ├── seed.sql                   # Sample Algerian data
    │   └── database.js                # SQLite connection + init
    ├── middleware/
    │   ├── auth.js                    # JWT verify middleware
    │   └── errorHandler.js
    ├── routes/
    │   ├── customerAuth.js            # POST /api/customers/register|login
    │   ├── restaurantAuth.js          # POST /api/restaurants/register|login
    │   └── offers.js                  # CRUD /api/offers
    └── uploads/                       # Restaurant images (multer)
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Axios    |
| Styling    | Plain CSS with custom design tokens |
| Backend    | Node.js, Express 4                  |
| Database   | SQLite3 (via better-sqlite3)        |
| Auth       | JWT (jsonwebtoken) + bcrypt         |
| File upload| Multer                              |

---

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env          # set JWT_SECRET
node server.js
# → http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## Algerian Cities Supported
Algiers, Oran, Constantine, Annaba, Blida, Batna, Djelfa, Sétif, Sidi Bel Abbès, Biskra, Tébessa, Tlemcen, Béjaïa, Skikda, Tiaret, Mostaganem, Médéa, Ouargla, Chlef, Msila, Mascara, Guelma, Souk Ahras, Jijel, Relizane, Saïda, Boumerdès, Khenchela, Tissemsilt, Bouira, Tizi Ouzou, Bordj Bou Arréridj

---

## API Endpoints

### Customer Auth
- `POST /api/customers/register` — `{ fullName, email, phone, city, password }`
- `POST /api/customers/login`    — `{ email, password }`

### Restaurant Auth
- `POST /api/restaurants/register` — `{ name, email, phone, city, password }`
- `POST /api/restaurants/login`    — `{ email, password }`

### Offers
- `GET  /api/offers`              — list all active offers (public)
- `GET  /api/offers?city=Algiers` — filter by city
- `POST /api/offers`              — create offer (restaurant JWT required)
- `PUT  /api/offers/:id`          — update offer (owner only)
- `DELETE /api/offers/:id`        — delete offer (owner only)
- `GET  /api/offers/mine`         — restaurant's own offers (JWT required)
