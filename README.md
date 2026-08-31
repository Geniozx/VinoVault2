# VinoVault 2.0

VinoVault is a full-stack personal wine cellar and collection-management application.

This version is a complete rebuild using React, Django REST Framework, PostgreSQL, and JWT authentication.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- ESLint

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- django-cors-headers

### Database

- PostgreSQL

## Project Structure

```text
vinovault2/
├── client/      React + Vite frontend
├── server/      Django + Django REST Framework backend
├── docs/        Project documentation
├── .gitignore
└── README.md
```

## Current Development Status

- Phase 1 — Project Foundation ✅
- Phase 2 — Django Models & Database ✅
- Phase 3 — Core Django REST API ✅
- Phase 4 — Authentication & Permissions ✅
- Phase 5 — React Foundation ✅
- Phase 6 — Wine Catalog — Next

---

## Phase 1 — Project Foundation

Completed:

- Git repository initialized
- React + Vite frontend created
- Python virtual environment created
- Django project initialized
- Django REST Framework installed
- CORS support configured
- PostgreSQL database created
- Django connected to PostgreSQL
- Environment variables configured
- Initial Django migrations applied

---

## Phase 2 — Django Models & Database

Completed:

- Created custom Django `User` model using `AbstractUser`
- Configured Django to use the custom user model
- Created `Winery` model
- Created `Region` model
- Created `Wine` model
- Added wine type choices and external API tracking fields
- Created `CellarEntry` model
- Added quantity, purchase, storage, and personal note fields
- Added unique user/wine cellar constraint
- Created `TastingNote` model
- Added personal ratings and tasting history support
- Created and applied PostgreSQL migrations
- Registered all core models with Django Admin
- Created and verified Django superuser access
- Tested User → CellarEntry relationships
- Tested Wine → CellarEntry relationships
- Tested Winery → Wine relationships
- Tested Region → Wine relationships
- Tested User/Wine → TastingNote relationships
- Verified duplicate cellar entries are rejected by PostgreSQL

### Phase 2 Validation

The following model behavior has been verified:

- Users can own wines through `CellarEntry`
- Wines can belong to a winery and region
- Wineries and regions can reference their related wines
- Users can create tasting notes for wines
- Wines can have multiple tasting notes
- A user cannot create duplicate cellar entries for the same wine
- Django system checks pass successfully

---

## Phase 3 — Core Django REST API

Completed:

- Created Django REST Framework serializers for:
  - `Winery`
  - `Region`
  - `Wine`
  - `CellarEntry`
  - `TastingNote`
- Added nested winery and region data to wine API responses
- Added writable `winery_id` and `region_id` fields for wine serialization
- Added writable `wine_id` fields for cellar entries and tasting notes
- Created public winery list and detail endpoints
- Created public region list and detail endpoints
- Created public wine list and detail endpoints
- Created authenticated cellar list/create endpoint
- Created authenticated cellar retrieve/update/delete endpoint
- Created authenticated tasting note list/create endpoint
- Created authenticated tasting note retrieve/update/delete endpoint
- Configured Django REST Framework session login for development API testing
- Configured cellar records to automatically use the authenticated user
- Configured tasting notes to automatically use the authenticated user
- Restricted cellar querysets to the authenticated user's records
- Restricted tasting note querysets to the authenticated user's records

### Phase 3 API Endpoints

#### Wine Catalog

```text
GET /api/wineries/
GET /api/wineries/:id/

GET /api/regions/
GET /api/regions/:id/

GET /api/wines/
GET /api/wines/:id/
```

#### Cellar

```text
GET    /api/cellar/
POST   /api/cellar/
GET    /api/cellar/:id/
PATCH  /api/cellar/:id/
DELETE /api/cellar/:id/
```

#### Tasting Notes

```text
GET    /api/tasting-notes/
POST   /api/tasting-notes/
GET    /api/tasting-notes/:id/
PATCH  /api/tasting-notes/:id/
DELETE /api/tasting-notes/:id/
```

### Phase 3 Validation

The following API behavior has been verified:

- Winery list and detail endpoints return data successfully
- Region list and detail endpoints return data successfully
- Wine list and detail endpoints return data successfully
- Wine responses include nested winery and region information
- Unauthenticated requests to private cellar endpoints are rejected
- Unauthenticated requests to private tasting note endpoints are rejected
- Authenticated users can create, update, and delete cellar entries
- Authenticated users can create, update, and delete tasting notes
- Cellar ownership is assigned from the authenticated Django user
- Tasting note ownership is assigned from the authenticated Django user
- A second authenticated user cannot retrieve another user's cellar entries
- A second authenticated user cannot retrieve another user's tasting notes
- Ownership isolation returns a 404 for records outside the authenticated user's queryset
- Django system checks pass successfully

---

## Phase 4 — Authentication & Permissions

Completed:

- Installed and configured Django REST Framework Simple JWT
- Configured JWT authentication for Django REST Framework
- Retained session authentication for development and browsable API testing
- Created user registration endpoint
- Created JWT login/token endpoint
- Created JWT refresh endpoint
- Created current-user endpoint
- Added Simple JWT token blacklist support
- Created authenticated logout endpoint
- Configured logout to blacklist refresh tokens
- Configured private API resources to authenticate through JWT
- Verified cellar ownership using JWT-authenticated users
- Verified tasting-note ownership protections
- Added public-read/admin-write permissions to the wine catalog
- Restricted wine, winery, and region modifications to admin users

### Phase 4 Authentication Endpoints

```text
POST /api/auth/register/
POST /api/auth/token/
POST /api/auth/token/refresh/
POST /api/auth/logout/
GET  /api/auth/me/
```

### Phase 4 Authentication Flow

```text
Register / Login
        ↓
Django validates credentials
        ↓
Access Token + Refresh Token
        ↓
Client sends Access Token
        ↓
Authorization: Bearer <access_token>
        ↓
Django identifies request.user
        ↓
Protected resource access
```

When an access token expires, the refresh token can be used to request a new access token.

On logout, the refresh token is blacklisted so it cannot be used to generate additional access tokens.

### Phase 4 Permissions

#### Public Users

- Browse wines
- View individual wines
- Browse wineries
- View individual wineries
- Browse regions
- View individual regions
- Register
- Log in

#### Authenticated Users

- Access their own cellar
- Create cellar entries
- Update their own cellar entries
- Delete their own cellar entries
- Access their own tasting notes
- Create tasting notes
- Update their own tasting notes
- Delete their own tasting notes
- View their authenticated user information

#### Admin Users

Admin users have catalog-management permissions in addition to authenticated-user permissions.

Admins can:

- Create wines
- Update wines
- Delete wines
- Create wineries
- Update wineries
- Delete wineries
- Create regions
- Update regions
- Delete regions

### Phase 4 Validation

The following authentication and permission behavior has been verified:

- New users can register successfully
- Registered users can obtain JWT access and refresh tokens
- Valid access tokens authenticate protected API requests
- `/api/auth/me/` returns the correct authenticated user
- Refresh tokens successfully generate new access tokens
- New access tokens successfully authenticate API requests
- Logout successfully blacklists the supplied refresh token
- Blacklisted refresh tokens cannot generate new access tokens
- Unauthenticated users cannot access private cellar data
- Unauthenticated users cannot access private tasting-note data
- Cellar entries created with JWT authentication are automatically assigned to the authenticated user
- Users can retrieve their own cellar entries
- Users cannot retrieve another user's cellar entries
- Users cannot retrieve another user's tasting notes
- Public users can read wine catalog data
- Regular authenticated users can read wine catalog data
- Regular authenticated users cannot modify wine catalog data
- Admin users can modify wine catalog data
- Django system checks pass successfully

---

## Phase 5 — React Foundation

Completed:

- Removed the default Vite starter content and unused assets
- Established the React frontend folder structure
- Installed and configured React Router
- Created initial application routes
- Created public and protected page components
- Created a reusable API service layer
- Configured the frontend API base URL through environment variables
- Connected the React frontend to the Django REST API
- Created wine API service functions
- Verified React can retrieve wine data from Django
- Created React authentication context
- Created reusable authentication service functions
- Implemented JWT login from React
- Implemented authenticated-user retrieval through `/api/auth/me/`
- Added local JWT token storage
- Added authentication-state restoration after browser refresh
- Created frontend protected-route handling
- Protected cellar-related routes from unauthenticated access
- Created shared Navbar and Footer components
- Added authentication-aware navigation
- Implemented frontend logout
- Integrated server-side refresh-token blacklisting into the logout flow
- Corrected logout navigation from protected routes
- Created the React registration form
- Connected registration to the Django registration API
- Added registration error handling
- Verified duplicate usernames return a user-facing validation error
- Separated authentication context, provider, and hook responsibilities for React Fast Refresh compatibility
- Removed remaining Vite starter dependencies and unused imports

### Phase 5 React Routes

#### Public Routes

```text
/
/browse
/wines/:id
/login
/register
```

#### Protected Routes

```text
/cellar
/cellar/add
/cellar/:id
/cellar/:id/edit
```

#### Fallback Route

```text
*
```

Unknown routes render the `NotFound` page.

### Phase 5 Frontend Structure

```text
client/src/
├── components/
│   ├── auth/
│   ├── cellar/
│   ├── layout/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── ui/
│   └── wines/
├── context/
│   ├── AuthContext.jsx
│   ├── authContext.js
│   └── useAuth.js
├── pages/
│   ├── AddCellarEntry.jsx
│   ├── BrowseWines.jsx
│   ├── CellarEntryDetails.jsx
│   ├── EditCellarEntry.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MyCellar.jsx
│   ├── NotFound.jsx
│   ├── Register.jsx
│   └── WineDetails.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── wineService.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

### Phase 5 Authentication Flow

```text
React Login Form
        ↓
POST /api/auth/token/
        ↓
Access + Refresh Tokens
        ↓
Tokens stored locally
        ↓
GET /api/auth/me/
        ↓
AuthContext stores current user
        ↓
Protected React routes become available
```

When the browser is refreshed:

```text
Stored Access Token
        ↓
AuthProvider initializes
        ↓
GET /api/auth/me/
        ↓
User restored
        ↓
Authenticated session continues
```

When the user logs out:

```text
Navigate away from protected route
        ↓
POST /api/auth/logout/
        ↓
Refresh token blacklisted by Django
        ↓
Local tokens removed
        ↓
AuthContext clears current user
        ↓
Public navigation restored
```

### Phase 5 Validation

The following frontend behavior has been verified:

- All configured React routes render successfully
- Unknown routes render the Not Found page
- React successfully communicates with the Django REST API
- Wine data can be retrieved from PostgreSQL through Django and displayed by React
- Valid Django credentials successfully authenticate through the React login form
- JWT access and refresh tokens are stored after successful login
- The authenticated user is loaded into React state
- Authentication survives a browser refresh
- Unauthenticated users are redirected away from protected cellar routes
- Authenticated users can access protected cellar routes
- Navigation changes based on authentication state
- Logout successfully clears the React authentication state
- Logout returns the user to the home page
- Refreshing after logout keeps the user logged out
- New users can register through the React frontend
- Successful registration redirects users to the login page
- Newly registered users can log in successfully
- Duplicate username registration errors are displayed to the user
- ESLint passes with no errors
- Vite production build completes successfully

---

## Local Development

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend API URL is configured through:

```text
client/.env
```

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Backend

```bash
cd server
source venv/bin/activate
python manage.py runserver
```

### Backend Validation

```bash
python manage.py check
python manage.py migrate
```

### Frontend Validation

```bash
npm run lint
npm run build
```

## Environment Variables

Backend database credentials and other server secrets are stored in:

```text
server/.env
```

Frontend environment configuration is stored in:

```text
client/.env
```

Environment files are excluded from Git and must not be committed.

## Development Workflow

VinoVault is being built in structured phases.

After every completed phase:

1. Run phase completion tests
2. Update `README.md`
3. Review Git changes
4. Commit changes
5. Push to the remote repository
6. Begin the next phase only after the push succeeds

## Next Phase

Phase 6 — Wine Catalog