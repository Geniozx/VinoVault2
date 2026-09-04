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
- Phase 6 — Wine Catalog ✅
- Phase 7 — Personal Cellar ✅
- Phase 8 — Tasting Notes ✅
- Phase 9 — Dashboard & Collection Experience ✅
- Phase 10 — Next

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



---

## Phase 6 — Wine Catalog

Completed:

- Created reusable `WineCard` component
- Created reusable `WineGrid` component
- Refactored the Browse Wines page to use reusable wine components
- Connected the wine catalog to the Django REST API
- Displayed wine catalog information including:
  - Wine name
  - Vintage
  - Winery
  - Region
  - Country
  - Wine type
  - Varietal
  - Wine image when available
- Created individual Wine Details pages
- Added dynamic wine detail routing using `/wines/:id`
- Added API service support for retrieving individual wines
- Added navigation between the wine catalog and wine detail pages
- Added graceful handling for invalid or nonexistent wine IDs
- Added client-side wine search
- Added wine-type filtering
- Added combined search and filter behavior
- Added reusable loading, error, and empty-state components
- Added appropriate loading states while retrieving catalog data
- Added user-facing API error handling
- Added an empty state when no wines match the current search or filter
- Verified existing authentication and protected-route behavior remained functional

### Phase 6 Wine Catalog Components

```text
client/src/components/
├── ui/
│   ├── EmptyState.jsx
│   ├── ErrorMessage.jsx
│   └── Loading.jsx
└── wines/
    ├── WineCard.jsx
    └── WineGrid.jsx
```

### Phase 6 Wine Service

The frontend wine service now supports retrieving both the complete catalog and individual wines:

```text
getWines()
getWineById(id)
```

These functions communicate with:

```text
GET /api/wines/
GET /api/wines/:id/
```

### Phase 6 Catalog Flow

```text
Browse Wines
      ↓
GET /api/wines/
      ↓
Wine data stored in React state
      ↓
Search + Type Filter
      ↓
Filtered wine collection
      ↓
WineGrid
      ↓
WineCard
      ↓
View Details
      ↓
/wines/:id
      ↓
GET /api/wines/:id/
      ↓
Wine Details
```

### Phase 6 Search

Users can search the loaded wine catalog by:

- Wine name
- Varietal
- Winery
- Region
- Country

Search is case-insensitive.

### Phase 6 Wine Type Filters

The catalog supports filtering by:

- Red
- White
- Rosé
- Sparkling
- Dessert
- Fortified

Search and wine-type filters can be used simultaneously.

### Phase 6 UI States

Reusable frontend components now handle the major API states:

```text
Fetching data
    ↓
Loading

Request failure
    ↓
ErrorMessage

No matching results
    ↓
EmptyState

Successful results
    ↓
WineGrid
```

These components can be reused throughout later VinoVault phases.

### Phase 6 Validation

The following Wine Catalog behavior has been verified:

- Wine catalog data loads successfully from Django
- Wine cards render successfully
- Wine information displays correctly on catalog cards
- Wine detail links navigate to the correct dynamic route
- Individual wine data loads successfully
- Wine Details displays the correct wine
- Back to Browse navigation works
- Invalid or nonexistent wine IDs display a friendly error
- Invalid wine IDs do not crash the React application
- Search by wine name works
- Search by varietal works
- Search by winery works
- Search by region works
- Search by country works
- Wine-type filtering works
- Search and filtering work together
- Searches with no matches display the empty state
- Loading states render while data is being retrieved
- API errors display through the reusable error component
- Protected cellar routes remain protected
- Existing authentication behavior remains functional
- ESLint passes with no errors
- Vite production build completes successfully



---

## Phase 7 — Personal Cellar

Completed:

- Connected the protected React cellar pages to the Django REST API
- Created a dedicated cellar API service layer
- Created reusable `CellarCard` components
- Built the authenticated My Cellar page
- Added loading, error, and empty states to the cellar
- Created individual cellar-entry detail pages
- Added dynamic cellar-entry routing
- Displayed wine information alongside personal cellar information
- Added cellar-entry editing
- Added quantity editing
- Added purchase-date editing
- Added purchase-price editing
- Added storage-location editing
- Added personal-notes editing
- Added cellar-entry deletion
- Added deletion confirmation before removing a wine
- Added catalog-to-cellar integration
- Added an authenticated Add to My Cellar flow
- Added wine selection through URL query parameters
- Added cellar-entry creation through the Django REST API
- Added automatic navigation to newly created cellar entries
- Added authentication-aware Add to Cellar controls on Wine Details
- Preserved backend ownership isolation for all cellar operations
- Preserved the unique user/wine cellar constraint
- Added user-facing handling for duplicate cellar entries
- Reused Phase 6 loading, error, and empty-state components throughout the cellar experience

### Phase 7 Cellar Routes

All personal cellar routes require authentication:

```text
/cellar
/cellar/add
/cellar/:id
/cellar/:id/edit
```

The Add Cellar Entry route accepts the selected wine through a query parameter:

```text
/cellar/add?wine=:wineId
```

### Phase 7 Cellar Service

The frontend cellar service supports:

```text
getCellarEntries()
getCellarEntryById(id)
createCellarEntry(entryData)
updateCellarEntry(id, entryData)
deleteCellarEntry(id)
```

These functions communicate with the protected Django endpoints:

```text
GET    /api/cellar/
POST   /api/cellar/
GET    /api/cellar/:id/
PATCH  /api/cellar/:id/
DELETE /api/cellar/:id/
```

JWT access tokens are included in protected cellar API requests.

### Phase 7 Personal Cellar Flow

```text
Authenticated User
        ↓
My Cellar
        ↓
GET /api/cellar/
        ↓
User-owned entries only
        ↓
CellarCard
        ↓
View Details
        ↓
/cellar/:id
        ↓
View / Edit / Remove
```

### Phase 7 Add-to-Cellar Flow

```text
Browse Wines
      ↓
Wine Details
      ↓
Add to My Cellar
      ↓
/cellar/add?wine=:wineId
      ↓
Load selected wine
      ↓
Enter cellar information
      ↓
POST /api/cellar/
      ↓
Django assigns authenticated user
      ↓
New Cellar Entry
      ↓
/cellar/:id
```

Unauthenticated users are shown a login option instead of direct access to the protected Add Cellar Entry page.

### Phase 7 Editable Cellar Information

Users can manage:

- Quantity
- Purchase date
- Purchase price
- Storage location
- Personal notes

Wine catalog information remains associated with the selected `Wine` record rather than being duplicated in the cellar entry.

### Phase 7 Ownership & Data Protection

Cellar ownership continues to be enforced by Django.

The frontend does not submit a user ID when creating cellar entries.

Instead:

```text
JWT Access Token
      ↓
Django request.user
      ↓
CellarEntry.user
```

Protected cellar querysets only return records owned by the authenticated user.

Attempting to access another user's cellar entry results in a not-found response rather than exposing the record.

The database also prevents a user from creating multiple cellar entries for the same wine.

### Phase 7 Validation

The following Personal Cellar behavior has been verified:

- Authenticated users can load their personal cellar
- Empty cellars display the reusable empty state
- Existing cellar entries render successfully
- Cellar cards display the associated wine information
- View Details navigates to the correct cellar entry
- Individual cellar entries load successfully
- Invalid or unauthorized cellar-entry IDs display an error
- Users can edit cellar quantity
- Users can edit purchase date
- Users can edit purchase price
- Users can edit storage location
- Users can edit personal notes
- Updated cellar data persists after browser refresh
- Users can cancel editing without modifying the entry
- Users can remove wines from their cellar
- Delete confirmation can be cancelled without removing the entry
- Confirmed deletion removes the entry
- Deleted entries remain deleted after browser refresh
- Authenticated users can add wines from the Wine Details page
- The Add Cellar Entry form loads the correct selected wine
- Newly created entries redirect to their detail page
- Newly created entries appear in My Cellar
- Duplicate cellar entries are rejected
- Duplicate-entry failures display a user-facing error
- Unauthenticated users cannot access cellar routes
- Users cannot retrieve another user's cellar entries
- Existing authentication behavior remains functional
- Existing Wine Catalog behavior remains functional
- ESLint passes with no errors
- Vite production build completes successfully




---

## Phase 8 — Tasting Notes

Completed:

- Created a dedicated tasting-note API service layer
- Added tasting-note list, detail, create, edit, and delete functionality
- Added protected tasting-note routes
- Added reusable `TastingNoteCard` components
- Built the My Tasting Notes page
- Added loading, error, and empty states
- Added Add Tasting Note flow from Wine Details
- Added tasting-note creation through the Django REST API
- Added tasting-note detail pages
- Added tasting-note editing
- Added tasting-note deletion with confirmation
- Added tasting-note history to individual Wine Details pages
- Added authentication-aware tasting-note controls
- Preserved backend ownership isolation
- Verified invalid and unauthorized tasting-note IDs return friendly errors
- Verified deleted notes disappear from wine history
- Verified ESLint passes
- Verified Vite production build completes successfully

### Phase 8 Tasting Note Routes

Protected routes:

```text
/tasting-notes
/tasting-notes/add
/tasting-notes/:id
/tasting-notes/:id/edit
```

The Add Tasting Note page accepts the selected wine through a query parameter:

```text
/tasting-notes/add?wine=:wineId
```

### Phase 8 Tasting Note Service

The frontend tasting-note service supports:

```text
getTastingNotes()
getTastingNoteById(id)
createTastingNote(noteData)
updateTastingNote(id, noteData)
deleteTastingNote(id)
```

These functions communicate with:

```text
GET    /api/tasting-notes/
POST   /api/tasting-notes/
GET    /api/tasting-notes/:id/
PATCH  /api/tasting-notes/:id/
DELETE /api/tasting-notes/:id/
```

JWT access tokens are included with protected requests.

### Phase 8 Tasting Note Flow

```text
Authenticated User
        ↓
Wine Details
        ↓
Add Tasting Note
        ↓
/tasting-notes/add?wine=:wineId
        ↓
Enter Rating / Date / Notes
        ↓
POST /api/tasting-notes/
        ↓
Tasting Note Details
```

### Phase 8 Tasting History Flow

```text
My Tasting Notes
        ↓
TastingNoteCard
        ↓
View Tasting Note
        ↓
Edit or Delete
        ↓
Return to My Tasting Notes
```

Wine Details also displays the authenticated user's tasting-note history for that wine.

### Phase 8 Ownership & Authentication

Tasting-note ownership remains enforced by Django.

The frontend does not submit a user ID when creating tasting notes.

Instead:

```text
JWT Access Token
      ↓
Django request.user
      ↓
TastingNote.user
```

Protected tasting-note querysets only return records owned by the authenticated user.

### Phase 8 Validation

Verified:

- Tasting-note list loads for authenticated users
- Empty tasting-note collections show an empty state
- Tasting notes can be created
- Created notes redirect to their detail page
- Tasting-note details load correctly
- Invalid tasting-note IDs show a friendly error
- Tasting notes can be edited
- Edited values persist after refresh
- Tasting notes can be deleted
- Delete confirmation can be cancelled
- Confirmed deletion removes the note
- Deleted notes remain deleted after refresh
- Deleted notes disappear from Wine Details history
- Wine Details shows tasting-note history for the selected wine
- Wines with no tasting notes show an empty-history message
- Protected tasting-note routes redirect unauthenticated users to login
- Users cannot access another user's tasting notes
- Existing wine catalog behavior remains functional
- Existing cellar behavior remains functional
- ESLint passes with no errors
- Vite production build completes successfully



---

## Phase 9 — Dashboard & Collection Experience

Completed:

* Created a protected authenticated-user dashboard
* Connected the dashboard to the personal cellar API
* Connected the dashboard to the tasting-note API
* Added collection overview statistics
* Added unique wine count
* Added total bottle count
* Added tasting-note count
* Added collection breakdown by wine type
* Added average tasting rating
* Added recent cellar additions
* Added recent tasting-note activity
* Added direct links from recent activity to detail pages
* Added dashboard quick actions
* Added authenticated dashboard navigation
* Updated successful login navigation to redirect to the dashboard
* Preserved logout navigation back to the public home page
* Added dashboard loading and error states
* Verified protected dashboard behavior
* Verified existing Wine Catalog, Personal Cellar, and Tasting Notes functionality
* Verified ESLint passes
* Verified Vite production build completes successfully

### Phase 9 Dashboard Route

The dashboard is protected by authentication:

```text
/dashboard
```

Unauthenticated users attempting to access the dashboard are redirected to:

```text
/login
```

Successful authentication now redirects users to:

```text
/dashboard
```

### Phase 9 Dashboard Data

The dashboard loads the authenticated user's existing cellar and tasting-note data:

```text
GET /api/cellar/
GET /api/tasting-notes/
```

Both requests use the authenticated user's JWT access token.

The dashboard does not maintain a separate copy of collection data. Instead, statistics are calculated from the existing API responses.

### Phase 9 Collection Overview

The dashboard displays:

* Unique Wines
* Total Bottles
* Tasting Notes
* Collection by Wine Type
* Average Tasting Rating

Unique wines are calculated from the number of personal cellar entries.

Total bottles are calculated by summing the quantity of each cellar entry:

```text
Cellar Entries
      ↓
quantity + quantity + quantity
      ↓
Total Bottles
```

### Phase 9 Collection Breakdown

The authenticated user's cellar is grouped by wine type.

Example:

```text
red: 3
white: 2
sparkling: 1
```

The breakdown is calculated from the wine associated with each cellar entry.

### Phase 9 Tasting Summary

When tasting notes exist, the dashboard calculates the user's average tasting rating.

```text
Tasting Note Ratings
        ↓
Sum of Ratings
        ↓
Divide by Number of Notes
        ↓
Average Rating
```

The displayed result is rounded to one decimal place.

When no tasting notes exist, the dashboard displays an empty tasting-summary message.

### Phase 9 Recent Activity

The dashboard displays up to three recent cellar additions and three recent tasting notes.

```text
Cellar Entries
      ↓
Sort by created_at
      ↓
Newest First
      ↓
First 3
```

```text
Tasting Notes
      ↓
Sort by created_at
      ↓
Newest First
      ↓
First 3
```

Recent cellar additions link directly to:

```text
/cellar/:id
```

Recent tasting notes link directly to:

```text
/tasting-notes/:id
```

### Phase 9 Dashboard Flow

```text
Login
  ↓
Dashboard
  ↓
Collection Overview
  ↓
Recent Activity
  ↓
Quick Actions
  ↓
Browse / My Cellar / Tasting Notes
```

### Phase 9 Navigation

Authenticated users can navigate directly to:

```text
Dashboard
My Cellar
Tasting Notes
Browse Wines
```

Browse remains available publicly.

Logout continues to:

```text
Clear authentication
        ↓
Return to /
```

### Phase 9 Validation

Verified:

* Dashboard loads for authenticated users
* Dashboard redirects unauthenticated users to login
* Successful login redirects to the dashboard
* Logout returns to the public home page
* Unique wine count is correct
* Total bottle calculation is correct
* Tasting-note count is correct
* Wine-type collection breakdown is correct
* Average tasting rating calculation is correct
* Empty collection states are handled
* Empty tasting-summary states are handled
* Recent cellar additions display correctly
* Recent tasting notes display correctly
* Recent cellar links open the correct cellar entries
* Recent tasting-note links open the correct tasting notes
* Dashboard quick actions work
* Dashboard navbar navigation works
* Browse Wines remains functional
* Personal Cellar remains functional
* Tasting Notes remains functional
* Existing authentication behavior remains functional
* ESLint passes with no errors
* Vite production build completes successfully




## Next Phase

Phase 10 — TBD
