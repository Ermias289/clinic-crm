## Clinic CRM API (ASP.NET Core 8)

This document describes the **Clinic CRM backend REST API** exposed by the `Clinic-CRM` .NET 8 project.  
All endpoints are implemented in the `Controllers` folder and delegate business logic to services in the `Services` folder (registered in `AppServiceRegistration`).

- **Platform**: ASP.NET Core 8 Web API
- **Authentication**: JWT Bearer (`Authorization: Bearer <token>`)
- **Serialization**: System.Text.Json (camelCase, enums as strings, nulls omitted, cycles ignored)
- **Database**: SQL Server via Entity Framework Core
- **API docs**: Integrated Swagger UI (`/swagger`)

---

## Base URL & Environment

By default the app runs on HTTPS (see `Program.cs`):

- **Health check**: `GET /health` → `200 OK` with `"OK"`
- **Swagger JSON**: `GET /swagger/v1/swagger.json`
- **Swagger UI**: `GET /swagger`

When deploying behind a reverse proxy you can set a path base (commented in `Program.cs`) as needed.

---

## Authentication & Authorization

### JWT Configuration

`Program.cs` configures JWT bearer authentication:

- Scheme: `Bearer`
- Signing key: `AppSettings:Token` (symmetric key in configuration)
- Audience / Issuer validation: disabled
- Clock skew: 0

Swagger is configured with a **Bearer** security scheme, so you can:

1. Open Swagger UI.
2. Click **Authorize**.
3. Paste `Bearer <token>` to call authorized endpoints from the UI.

### Roles & Permissions

Authorization is enforced **manually** in most controllers using:

- `IUserService.GetCurrentUser()` to retrieve the current user from the token.
- Role name and permission flags from `currentUser.UserRole`, for example:
  - `USER_ROLES.SUPER_ADMIN`
  - `CanViewPatient`, `CanAddPatient`, `CanViewAppointment`, `CanMakeAppointment`, `CanViewCardPayment`, etc.

Patterns:

- If `currentUser` is `null` or the role flag is missing → `UnauthorizedAccessException` → standardized error response via `this.ParseException(ex)`.
- Some controllers use `[Authorize]` attributes in addition to manual checks.

You must:

1. **Authenticate** using `AuthController` (`/api/Auth/login`) to obtain a JWT.
2. **Attach the JWT** on all subsequent calls that require authorization.

---

## Conventions

- **Route prefix**: All controllers use `[Route("api/[controller]")]` (except `TestEmailController` which uses `api/test-email`).
- **Return type**: Usually `ActionResult` or `ActionResult<T>` with `Ok(...)` for success and `this.ParseException(ex)` for failures.
- **DTOs**: Request/response payloads are defined in the `DTOs` namespace, e.g.:
  - `CreateUserAccountDTO`, `LogInDTO`, `ChangePasswordDTO`
  - `AddPatientDTO`, `UpdatePatientDTO`
  - `AddAppointmentDTO`
  - `CreatePaymentDTO`, `CheckPaymentDTO`, `ApprovePaymentDTO`, `CancelPaymentDTO`, `RejectPaymentDTO`
  - `AddMedicalServiceDTO`, `UpdateMedicalServiceDTO`, etc.

For full schema details, refer to Swagger or the DTO classes under the `DTOs` folder.

---

## High-Level Modules & Controllers

Below is a per-controller summary of the main endpoints, their HTTP methods and purposes.

> **Note**: All routes are relative to the base `api/<ControllerName>` unless explicitly specified.

### 1. AuthController (`/api/Auth`)

Handles registration, login and password changes.

| Method | Route               | Body DTO               | Auth | Description                              |
|--------|---------------------|------------------------|------|------------------------------------------|
| POST   | `/api/Auth/register`| `CreateUserAccountDTO` | No   | Register a new user account.             |
| POST   | `/api/Auth/login`   | `LogInDTO`             | No   | Log in with phone/email and password; returns a JWT (`LogInReturnDTO`). |
| POST   | `/api/Auth/changePassword` | `ChangePasswordDTO` | Yes | Change password for the current user.    |

**Login details**

- Finds user by `dto.PhoneOrEmail` against `Users.PhoneNumber` or `Users.Email`.
- Verifies password using stored `PasswordHash`/`PasswordSalt`.
- Delegates JWT creation to `_userService.CreateToken(user)`.

### 2. UserController (`/api/User`)

Manage internal system users (admin / back-office operators).

| Method | Route                      | Body DTO               | Permission flag          | Description                          |
|--------|----------------------------|------------------------|--------------------------|--------------------------------------|
| POST   | `/api/User`                | `CreateUserAccountDTO` | `CanAddUser`             | Create a user.                       |
| GET    | `/api/User`                | –                      | `CanViewUser`            | List all users.                      |
| GET    | `/api/User/{id}`           | –                      | `CanViewUser`            | Get user by ID.                      |
| PUT    | `/api/User/{id}`           | `UpdateUserAccountDTO` | `CanEditUser`            | Update a user.                       |
| DELETE | `/api/User/{id}`           | –                      | `CanAddUser`             | Delete a user.                       |
| PUT    | `/api/User/confirmAccount` | query: `OTP`, `email`  | `CanAddUser`             | Confirm a user account via OTP+email.|

Requires authentication via `[Authorize]` and manual permission checks.

### 3. UserRoleController (`/api/UserRole`)

Manage roles & permissions.

| Method | Route                          | Body DTO / Model | Permission flag | Description                              |
|--------|--------------------------------|------------------|-----------------|------------------------------------------|
| POST   | `/api/UserRole`               | `UserRole`       | `CanAddRole`    | Create a new role.                       |
| GET    | `/api/UserRole`               | –                | `CanAddRole`    | Get all roles.                           |
| GET    | `/api/UserRole/{id}`          | –                | `CanAddRole`    | Get a role by ID.                        |
| GET    | `/api/UserRole/getRoleByName` | query: `Name`    | (no checks)     | Get a role by name.                      |
| PUT    | `/api/UserRole`               | `UserRole`       | `CanEditUser`   | Update existing role.                    |
| DELETE | `/api/UserRole/{id}`          | –                | `CanAddRole`    | Delete a role.                           |

### 4. PatientController (`/api/Patient`)

Patients CRUD and lookup.

| Method | Route                       | Body DTO          | Permission flag   | Description                     |
|--------|-----------------------------|-------------------|-------------------|---------------------------------|
| GET    | `/api/Patient`              | –                 | `CanViewPatient`  | List all patients.              |
| GET    | `/api/Patient/{Id}`         | –                 | `CanViewPatient`  | Get patient by ID.              |
| DELETE | `/api/Patient/{Id}`         | –                 | `CanAddPatient`   | Delete patient by ID.           |
| POST   | `/api/Patient`              | `AddPatientDTO`   | `CanAddPatient`   | Create a new patient.           |
| PUT    | `/api/Patient`              | `UpdatePatientDTO`| `CanEditPatient`  | Update patient details.         |
| GET    | `/api/Patient/byUserId/{Id}`| –                 | `CanViewPatient`  | Get a patient by linked user ID.|

All endpoints require JWT (`[Authorize]`).

### 5. MedicalProfessionalController (`/api/MedicalProfessional`)

Doctors / clinicians (medical professionals).

| Method | Route                                  | Body DTO                         | Permission flag             | Description                        |
|--------|----------------------------------------|----------------------------------|-----------------------------|------------------------------------|
| POST   | `/api/MedicalProfessional`            | `AddMedicalProfessionalDTO`      | `CanAddMedicalProfessional` | Create medical professional.       |
| PUT    | `/api/MedicalProfessional`            | `UpdateMedicalProfessionalDTO`   | `CanEditMedicalProfessional`| Update professional.               |
| GET    | `/api/MedicalProfessional/{Id}`       | –                                | `CanViewMedicalProfessional`| Get professional by ID.            |
| DELETE | `/api/MedicalProfessional/{Id}`       | –                                | `CanAddMedicalProfessional` | Delete professional.               |
| GET    | `/api/MedicalProfessional`            | –                                | `CanViewMedicalProfessional`| List all professionals.            |

### 6. MedicalServiceController (`/api/MedicalService`)

Clinical services (e.g. consultation, lab tests).

| Method | Route                                          | Body DTO                 | Permission flag          | Description                                          |
|--------|------------------------------------------------|--------------------------|--------------------------|------------------------------------------------------|
| GET    | `/api/MedicalService`                         | –                        | `CanViewMedicalService` | List all medical services.                           |
| GET    | `/api/MedicalService/filteredService`         | query: `serviceId?`, `branchId?`, `docId?` | `CanViewMedicalService` | Filter services for appointment booking. |
| GET    | `/api/MedicalService/{Id}`                    | –                        | `CanViewMedicalService` | Get service by ID.                                   |
| DELETE | `/api/MedicalService/{Id}`                    | –                        | `CanAddMedicalService`  | Delete a service.                                    |
| POST   | `/api/MedicalService`                         | `AddMedicalServiceDTO`   | `CanAddMedicalService`  | Create a service.                                    |
| PUT    | `/api/MedicalService`                         | `UpdateMedicalServiceDTO`| `CanUpdateMedicalService`| Update a service.                                    |

### 7. DocServiceController (`/api/DocService`)

Doctor–Service mappings and availability.

| Method | Route                                   | Body DTO            | Permission flag                   | Description                                        |
|--------|-----------------------------------------|---------------------|----------------------------------|----------------------------------------------------|
| GET    | `/api/DocService`                      | –                   | `CanViewMedicalProfessional`     | List all doctor services.                          |
| GET    | `/api/DocService/{Id}`                 | –                   | `CanViewMedicalProfessional`     | Get mapping by ID.                                 |
| DELETE | `/api/DocService/{Id}`                 | –                   | `CanAddMedicalProfessional`      | Delete mapping.                                    |
| PUT    | `/api/DocService`                      | `UpdateDocServiceDTO`| `CanEditMedicalProfessional`    | Update mapping.                                    |
| POST   | `/api/DocService`                      | `AddDocServiceDTO`  | `CanAddMedicalProfessional`      | Add mapping.                                       |
| GET    | `/api/DocService/docService`           | query: `serviceId?`, `branchId?`, `docId?` | `CanViewMedicalProfessional` | Filter services/doctor combinations for appointments. |

### 8. AppointmentController (`/api/Appointment`)

Appointments management.

| Method | Route                                  | Body DTO             | Permission flag               | Description                                     |
|--------|----------------------------------------|----------------------|-------------------------------|-------------------------------------------------|
| GET    | `/api/Appointment`                    | –                    | `CanViewAppointment`          | List all appointments.                          |
| GET    | `/api/Appointment/{Id}`               | –                    | `CanViewAppointment`          | Get appointment by ID.                          |
| GET    | `/api/Appointment/bypatientId/{Id}`   | –                    | `CanViewAppointment`          | List appointments by patient ID.                |
| DELETE | `/api/Appointment/{Id}`               | –                    | `CanMakeAppointment`          | Delete appointment.                             |
| POST   | `/api/Appointment`                    | `AddAppointmentDTO`  | `CanMakeAppointment`          | Create a new appointment.                       |
| PUT    | `/api/Appointment/cancelAppointment`  | query: `Id`, `reason`| `CanCancelCardPayment`        | Cancel appointment with a reason.               |
| PUT    | `/api/Appointment/completeAppointments`| body: `List<int>`   | `CanCompleteAppointment`      | Mark multiple appointments as completed.        |
| GET    | `/api/Appointment/byuserId/{userId}`  | –                    | `CanViewAppointment`          | List appointments by user ID.                   |
| GET    | `/api/Appointment/bydocId/{Id}`       | –                    | `CanViewAppointment`          | List appointments by doctor ID.                 |
| GET    | `/api/Appointment/getFreeSlots`       | query: `docId`, `day`, `branchId` | (no role check) | Get free slot times for an appointment date.    |

### 9. DoctorScheduleController (`/api/DoctorSchedule`)

Doctor working schedules.

| Method | Route                                     | Body DTO                    | Permission flag                | Description              |
|--------|-------------------------------------------|-----------------------------|--------------------------------|--------------------------|
| GET    | `/api/DoctorSchedule`                    | –                           | `CanViewDoctorSchedule`        | List all doctor schedules. |
| POST   | `/api/DoctorSchedule`                    | `AddDoctorScheduleDTO`      | `CanAddDoctorSchedule`         | Create schedule.         |
| PUT    | `/api/DoctorSchedule`                    | `UpdateDoctorScheduleDTO`   | `CanEditDoctorSchedule`        | Update schedule.         |
| GET    | `/api/DoctorSchedule/{Id}`               | –                           | `CanViewDoctorSchedule`        | Get schedule by ID.      |
| DELETE | `/api/DoctorSchedule/{Id}`               | –                           | `CanAddDoctorSchedule`         | Delete schedule.         |
| GET    | `/api/DoctorSchedule/getByDocId{Id}`     | –                           | `CanViewDoctorSchedule`        | Get schedules by doctor. |

### 10. WorkingDaySettingController (`/api/WorkingDaySetting`)

Working day configuration (e.g. clinic open days/hours).

| Method | Route                                | Body DTO                        | Permission flag             | Description                           |
|--------|--------------------------------------|---------------------------------|-----------------------------|---------------------------------------|
| POST   | `/api/WorkingDaySetting`            | `AddWorkingDaySettingDTO`       | `CanAddWorkingSetting`     | Add working day settings.             |
| PUT    | `/api/WorkingDaySetting`            | `UpdateWorkingDaySettingDTO`    | `CanEditWorkingSetting`    | Update working day settings.          |
| GET    | `/api/WorkingDaySetting`            | –                               | (no check)                 | Get all working day settings.         |
| GET    | `/api/WorkingDaySetting/{Id}`       | –                               | (no check)                 | Get specific working day setting.     |
| DELETE | `/api/WorkingDaySetting/{Id}`       | –                               | `CanAddWorkingSetting`     | Delete a working day setting.         |

### 11. BranchSettingController (`/api/BranchSetting`)

Branches configuration (multi-branch clinics).

| Method | Route                              | Body DTO              | Permission flag              | Description                   |
|--------|------------------------------------|-----------------------|------------------------------|-------------------------------|
| GET    | `/api/BranchSetting`              | –                     | `CanViewBranchSetting`       | List all branches.            |
| GET    | `/api/BranchSetting/{Id}`         | –                     | `CanViewBranchSetting`       | Get branch by ID.             |
| DELETE | `/api/BranchSetting/{Id}`         | –                     | `CanAddBranchSetting`        | Delete branch.                |
| POST   | `/api/BranchSetting`              | `AddBranchSettingDTO` | `CanAddBranchSetting`        | Create branch.                |
| PUT    | `/api/BranchSetting`              | `UpdateBranchSettingDTO` | `CanEditBranchSetting`   | Update branch.                |

### 12. CardController (`/api/Card`)

Patient loyalty/insurance cards.

| Method | Route                             | Body DTO          | Permission flag          | Description                            |
|--------|-----------------------------------|-------------------|--------------------------|----------------------------------------|
| POST   | `/api/Card`                      | `RequestCardDTO`  | `CanRequestCard`         | Request a new card.                    |
| PUT    | `/api/Card`                      | `UpdateCardDTO`   | `CanEditCard`            | Update card details.                   |
| GET    | `/api/Card`                      | –                 | `CanViewCard`            | List all cards.                        |
| GET    | `/api/Card/getByRef/{reference}` | –                 | `CanViewCard`            | Get card by reference.                 |
| GET    | `/api/Card/{Id}`                 | –                 | `CanViewCard`            | Get card by ID.                        |
| PUT    | `/api/Card/{Id}`                 | –                 | `CanRequestCard`         | Reactivate a card.                     |
| GET    | `/api/Card/cardByUserId/{UserId}`| –                 | `CanViewCard`            | Get cards by user ID.                  |

### 13. CardSettingController (`/api/CardSetting`) & CardTypeController (`/api/CardType`)

Configuration of card rules and card types.

**CardSettingController**

| Method | Route                       | Body DTO              | Permission flag         | Description                |
|--------|-----------------------------|-----------------------|-------------------------|----------------------------|
| GET    | `/api/CardSetting`         | –                     | `CanViewCardSetting`    | List all card settings.   |
| GET    | `/api/CardSetting/{Id}`    | –                     | `CanViewCardSetting`    | Get setting by ID.        |
| POST   | `/api/CardSetting`         | `AddCardSettingDTO`   | `CanAddCardSetting`     | Add setting.              |
| DELETE | `/api/CardSetting/{Id}`    | –                     | `CanAddCardSetting`     | Delete setting.           |
| PUT    | `/api/CardSetting`         | `UpdateCardSettingDTO`| `CanEditCardSetting`    | Update setting.           |

**CardTypeController**

| Method | Route                     | Body DTO             | Permission flag        | Description                  |
|--------|---------------------------|----------------------|------------------------|------------------------------|
| GET    | `/api/CardType`          | –                    | `CanViewCardType`      | List all card types.         |
| GET    | `/api/CardType/{Id}`     | –                    | `CanViewCardType`      | Get card type by ID.         |
| DELETE | `/api/CardType/{Id}`     | –                    | `CanAddCardType`       | Delete type.                 |
| PUT    | `/api/CardType`          | `UpdateCardTypeDTO`  | `CanEditCardType`      | Update type.                 |
| POST   | `/api/CardType`          | `AddCardTypeDTO`     | `CanAddCardType`       | Create type.                 |

### 14. PaymentController (`/api/Payment`) & PaymentTypeController (`/api/PaymentType`)

**PaymentController**

| Method | Route                             | Body DTO             | Permission flag              | Description                                       |
|--------|-----------------------------------|----------------------|--------------------------------|---------------------------------------------------|
| PUT    | `/api/Payment/paymentRequest`    | `CreatePaymentDTO`   | `CanRequestCardPayment`       | Create card payment request.                      |
| PUT    | `/api/Payment/checkPayment`      | `CheckPaymentDTO`    | `CanCheckCardPayment`         | Check payment status with provider.               |
| PUT    | `/api/Payment/approvePayment`    | `ApprovePaymentDTO`  | `CanApproveCardPayment`       | Approve payment.                                  |
| PUT    | `/api/Payment/cancelPayment`     | `CancelPaymentDTO`   | `CanCancelCardPayment`        | Cancel payment.                                   |
| PUT    | `/api/Payment/rejectPayment`     | `RejectPaymentDTO`   | `CanRejectCardPayment`        | Reject payment.                                   |
| GET    | `/api/Payment/{Status}`          | –                    | `CanViewCardPayment`          | Get payments by status.                           |
| GET    | `/api/Payment`                   | –                    | `CanViewCardPayment`          | Get all payments.                                 |
| GET    | `/api/Payment/{Id}` (route typo: `/{Id}`) | –           | `CanViewCardPayment`          | Get payment by ID.                                |
| GET    | `/api/Payment/bypatientId/{patientId}` | –             | `CanViewCardPayment`          | Get payments by patient ID.                       |
| GET    | `/api/Payment/bycardId/{cardId}` | –                    | `CanViewCardPayment`          | Get payments by card ID.                          |

**PaymentTypeController**

| Method | Route                      | Body DTO              | Permission flag        | Description                        |
|--------|----------------------------|-----------------------|------------------------|------------------------------------|
| DELETE | `/api/PaymentType/{Id}`   | –                     | `CanAddPaymentType`    | Delete payment type.               |
| PUT    | `/api/PaymentType`        | `UpdatePaymentTypeDTO`| `CanEditPaymentType`   | Update payment type.               |
| POST   | `/api/PaymentType`        | `AddPaymentTypeDTO`   | `CanAddPaymentType`    | Create payment type.               |
| GET    | `/api/PaymentType`        | –                     | `CanViewPaymentType`   | List all payment types.            |
| GET    | `/api/PaymentType/{Id}`   | –                     | `CanViewPaymentType`   | Get payment type by ID.            |

### 15. Dashboard & Reporting (`/api/DashBoard`)

High-level analytics endpoints.

| Method | Route                                    | Description                                      |
|--------|------------------------------------------|--------------------------------------------------|
| GET    | `/api/DashBoard/AppointmentReport`      | Appointment report between `fromDate` and `toDate` (query). |
| GET    | `/api/DashBoard/MostBookedServices`     | Most frequently booked services.                 |

### 16. NotificationController (`/api/Notification`)

User notifications.

| Method | Route                                  | Params                       | Permission flag          | Description                 |
|--------|----------------------------------------|------------------------------|--------------------------|-----------------------------|
| GET    | `/api/Notification`                   | query: `userId`             | `CanViewNotification`    | List notifications for user.|
| PUT    | `/api/Notification/markAllasRead`     | query: `userId`             | `CanReadNotification`    | Mark all as read.          |
| PUT    | `/api/Notification/markAsRead`        | query: `userId`, `notificationId` | `CanReadNotification` | Mark one notification as read. |

### 17. UserOnBoardingSettingController (`/api/UserOnBoardingSetting`) & BannerController (`/api/Banner`)

**UserOnBoardingSettingController**

| Method | Route                                   | Body DTO                        | Permission flag                       | Description                     |
|--------|-----------------------------------------|---------------------------------|---------------------------------------|---------------------------------|
| POST   | `/api/UserOnBoardingSetting`           | `AddUserOnBoardingSettingDTO`   | `CanAddUserOnBoarding`               | Add onboarding setting.         |
| PUT    | `/api/UserOnBoardingSetting`           | `UpdateUserOnBoardingSettingDTO`| `CanEditUserOnBoarding`              | Update onboarding setting.      |
| GET    | `/api/UserOnBoardingSetting/{Id}`      | –                               | `CanViewUserOnBoardingSetting`       | Get onboarding setting by ID.   |
| DELETE | `/api/UserOnBoardingSetting/{Id}`      | –                               | `CanViewUserOnBoardingSetting`       | Delete onboarding setting.      |
| GET    | `/api/UserOnBoardingSetting`           | –                               | `CanViewUserOnBoardingSetting`       | List all onboarding settings.   |

**BannerController**

| Method | Route                     | Params/Body | Permission flag         | Description                          |
|--------|---------------------------|------------|-------------------------|--------------------------------------|
| POST   | `/api/Banner/add`        | `Image` (string) | `CanAddUserOnBoarding` | Add a banner.                       |
| GET    | `/api/Banner/{id}`       | –          | (no checks)             | Get banner by ID.                   |
| GET    | `/api/Banner`            | –          | (no checks)             | List all banners.                   |
| DELETE | `/api/Banner/{id}`       | –          | `CanAddUserOnBoarding`  | Remove banner.                      |
| PUT    | `/api/Banner/{id}`       | `image`, `isActive` (query/body) | `CanAddUserOnBoarding` | Update banner.        |

### 18. CompanySettingController (`/api/CompanySetting`)

Global company / clinic configuration.

| Method | Route                       | Body DTO                 | Permission flag            | Description                      |
|--------|-----------------------------|--------------------------|----------------------------|----------------------------------|
| GET    | `/api/CompanySetting`       | –                        | (checks commented out)     | Get current company settings.   |
| PUT    | `/api/CompanySetting`       | `UpdateCompanySettingDto`| `CanEditCompanySettings`   | Update company settings.        |

### 19. BankController (`/api/Bank`) & BankAccountController (`/api/BankAccount`)

**BankController**

| Method | Route                    | Body DTO        | Permission flag       | Description            |
|--------|--------------------------|-----------------|-----------------------|------------------------|
| POST   | `/api/Bank`             | `AddBankDTO`    | `CanAddBank`          | Add a bank.           |
| GET    | `/api/Bank`             | –               | `CanViewBank`         | List all banks.       |
| GET    | `/api/Bank/{id}`        | –               | `CanViewBank`         | Get bank by ID.       |
| PUT    | `/api/Bank`             | `UpdateBankDTO` | `CanEditBank`         | Update bank.          |
| DELETE | `/api/Bank/{id}`        | –               | `CanAddBank`          | Delete bank.          |

**BankAccountController**

| Method | Route                          | Body DTO                | Permission flag           | Description                                |
|--------|--------------------------------|-------------------------|---------------------------|--------------------------------------------|
| POST   | `/api/BankAccount`            | `AddBankAccountDTO`     | `CanAddBankAccount`       | Add a bank account.                        |
| GET    | `/api/BankAccount`            | query: `Id?` (bankId)   | `CanViewBankAccount`      | List accounts by bank or all.             |
| GET    | `/api/BankAccount/{id}`       | –                       | `CanViewBankAccount`      | Get bank account by ID.                    |
| PUT    | `/api/BankAccount`            | `UpdateBankAccountDTO`  | `CanEditBankAccount`      | Update bank account.                       |
| DELETE | `/api/BankAccount/{id}`       | –                       | `CanAddBankAccount`       | Delete bank account.                       |

### 20. OTPController (`/api/OTP`)

One-time password for account verification and emails.

| Method | Route                          | Params              | Description                          |
|--------|--------------------------------|---------------------|--------------------------------------|
| GET    | `/api/OTP/resendOTP`          | `recipientEmail`    | Send/resend OTP email.               |
| POST   | `/api/OTP/verifyOTP`          | `email`, `submittedOtp` | Verify OTP for email.            |

### 21. Email Test Controller (`/api/test-email`)

Simple test for the email sending service.

| Method | Route                 | Params                                  | Description                     |
|--------|-----------------------|-----------------------------------------|---------------------------------|
| GET    | `/api/test-email`    | `recipientEmail`, `subject`, `body`, `isHtml?` | Send a test email.   |

### 22. FileUploadController (`/api/FileUpload`)

File upload/download support (e.g. images, documents).

| Method | Route                                  | Body / Params                    | Description                                |
|--------|----------------------------------------|----------------------------------|--------------------------------------------|
| GET    | `/api/FileUpload/{fileName}`          | –                                | Get file by name (stream).                 |
| POST   | `/api/FileUpload/upload`              | `IFormFile file`                 | Upload single file. Returns `{ fileName }`.|
| POST   | `/api/FileUpload/upload/multiple`     | `List<IFormFile> files` (form)   | Upload multiple files.                     |
| GET    | `/api/FileUpload/download/{fileName}` | –                                | Download file by name.                     |

---

## Error Handling

Most controllers wrap logic with `try/catch` and call `this.ParseException(ex)`:

- Converts exceptions (including `UnauthorizedAccessException`) to a standardized API error response.
- Typical client behavior:
  - **4xx** errors: bad input, validation problems, missing permissions.
  - **5xx** errors: unexpected server issues.

Refer to the `Helpers` extension methods and global exception handling in production for exact error shape.

---

## Using This API From a Frontend

When building a frontend (e.g. React + TypeScript), the usual flow is:

1. **Login**
   - `POST /api/Auth/login` with `{ phoneOrEmail, password }`.
   - Store returned JWT (`LogInReturnDTO`) in memory or secure storage.
2. **Attach token**
   - For every authenticated call, set `Authorization: Bearer <token>` header.
3. **Populate master data**
   - Call:
     - `/api/CompanySetting`
     - `/api/BranchSetting`
     - `/api/CardType`, `/api/CardSetting`
     - `/api/Bank`, `/api/BankAccount`
4. **Operational flows**
   - Patients: CRUD via `/api/Patient`.
   - Professionals & services: `/api/MedicalProfessional`, `/api/MedicalService`, `/api/DocService`.
   - Scheduling: `/api/DoctorSchedule`, `/api/WorkingDaySetting`, `/api/Appointment/getFreeSlots`.
   - Appointments: `/api/Appointment`.
   - Payments & cards: `/api/Card`, `/api/Payment`, `/api/PaymentType`.
   - Notifications: `/api/Notification`.

Swagger provides an always-up-to-date view of request and response schemas; this README is intended as a **map of modules, routes and responsibilities** for quickly integrating or building a frontend on top of this backend.

