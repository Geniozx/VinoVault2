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

```text
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



## Next Phase

Phase 3 — Core Django REST API