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


GET /api/wineries/
GET /api/wineries/:id/

GET /api/regions/
GET /api/regions/:id/

GET /api/wines/
GET /api/wines/:id/


#### Cellar


GET    /api/cellar/
POST   /api/cellar/
GET    /api/cellar/:id/
PATCH  /api/cellar/:id/
DELETE /api/cellar/:id/


#### Tasting Notes


GET    /api/tasting-notes/
POST   /api/tasting-notes/
GET    /api/tasting-notes/:id/
PATCH  /api/tasting-notes/:id/
DELETE /api/tasting-notes/:id/

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



## Next Phase

Phase 4 — Authentication & Permissions