# Mobile App Implementation Plan (Step-by-Step)

This plan outlines the step-by-step process to build the mobile application, starting from the foundation and authentication.

## Step 1: Foundation & Setup
**Objective**: Prepare the project for development.
- [x] **Verify Architecture**: Ensure `clean_architecture` structure (lib/config, lib/core, lib/data, lib/domain, lib/presentation).
- [x] **Dependencies**: Add `get`, `get_storage`, `dio` (or `get_connect`), `flutter_dotenv`.
- [x] **Environment**: Setup `.env` loading for API base URL.
- [x] **Core Utilities**:
    - Initialize `GetStorage` in `main.dart`.
    - Create `ApiClient` with base URL.
    - Create `AuthInterceptor` for token management.

## Step 2: Authentication (Login & Signup)
**Objective**: Allow users to sign in and register.
### Data & Domain
- [x] Create `AuthRemoteDataSource` (login, register).
- [x] Create `AuthRepositoryImpl` & `AuthRepository` interface.
- [x] Create `LoginUseCase` & `RegisterUseCase`.
### Presentation (Login)
- [x] Create `LoginController`.
- [x] Build `LoginView` (Email/Phone, Password, Login Button).
- [x] Handle navigation to Dashboard on success.
### Presentation (Signup)
- [x] Create `RegisterController`.
- [x] Build `RegisterView` (Full form fields).
- [x] Handle navigation on success.

## Step 3: Main Navigation & Dashboard
**Objective**: Create the main shell of the app after login.
- [ ] Create `DashboardView` (or `HomeView`).
- [ ] Implement logout functionality.

## Step 4: Company Settings
**Objective**: View and update company information.
- [ ] **Data**: `CompanySettingsRemoteDataSource` & Repository.
- [ ] **Domain**: `GetCompanySettingsUseCase`, `UpdateCompanySettingsUseCase`.
- [ ] **UI**: `CompanySettingsController` & `CompanySettingsView` (View/Edit).

## Step 5: User Management
**Objective**: Manage application users (Admin feature).
- [ ] **Data**: `UserRemoteDataSource` & Repository.
- [ ] **Domain**: UseCases for CRUD operations.
- [ ] **UI**: `UserController`, `UserListView`, `UserDetailView`, `UserFormView`.
