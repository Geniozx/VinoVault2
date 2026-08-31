# VinoVault 2.0

VinoVault is a full-stack personal wine cellar and collection-management application.

This version is a complete rebuild using React, Django REST Framework, and PostgreSQL.

## Tech Stack

### Frontend
- React
- Vite
- React Router

### Backend
- Python
- Django
- Django REST Framework
- django-cors-headers

### Database
- PostgreSQL

## Project Structure


vinovault2/
├── client/      React + Vite frontend
├── server/      Django + Django REST Framework backend
├── docs/        Project documentation
├── .gitignore
└── README.md


### Phase 1 — Project Foundation

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



### Phase 2 — Django Models & Database

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



### Phase 3 — Core Django REST API

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
- Authenticated users can create cellar entries
- Authenticated users can update cellar entries
- Authenticated users can delete cellar entries
- Authenticated users can create tasting notes
- Authenticated users can update tasting notes
- Authenticated users can delete tasting notes
- Cellar ownership is assigned from the authenticated Django user rather than client-provided user IDs
- Tasting note ownership is assigned from the authenticated Django user
- A second authenticated user cannot retrieve another user's cellar entries
- A second authenticated user cannot retrieve another user's tasting notes
- Ownership isolation returns a 404 for records outside the authenticated user's queryset
- Django system checks pass successfully



### Phase 4 — Authentication & Permissions

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

## Local Development

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
source venv/bin/activate
python manage.py runserver
```

## Environment Variables

Backend database credentials and other server secrets are stored in:

```text
server/.env
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

Phase 5 — React Foundation