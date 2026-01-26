# JSF Demo - Angular 20 with Signals

Modern demo of the JSF library (JSON Schema Form) using **Angular 20** with **Signals** for reactive state management.

## 🚀 Features

- ✅ **Angular 20** with standalone architecture
- ✅ **Signals** for reactive state management
- ✅ No NgModules (100% standalone architecture)
- ✅ Modern configuration with `ApplicationConfig`
- ✅ Lazy loading routes
- ✅ Complete CRUD example with modal forms
- ✅ Comprehensive JSF schema demonstrating all features

## 🎯 Quick Start

### Run the Demo

```bash
# From the root of the workspace
ng serve jsf-demo
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
ng build jsf-demo --configuration=production
```

## 📁 Project Structure

```
jsf-demo/
├── src/
│   ├── app/
│   │   ├── api-example/                  # Main component
│   │   │   ├── api-example.component.ts
│   │   │   ├── api-example.component.html
│   │   │   ├── api-example.component.scss
│   │   │   └── user-modal/              # Modal with JSF form
│   │   │       ├── user-modal.component.ts
│   │   │       ├── user-modal.component.html
│   │   │       └── user-modal.component.scss
│   │   ├── services/
│   │   │   └── api.service.ts           # Service with signals
│   │   ├── api-example-schema.json      # Complete JSF schema
│   │   ├── api-example-data.json        # Initial data
│   │   ├── app.config.ts                # Standalone config
│   │   ├── app.routes.ts                # Lazy loading routes
│   │   └── app.component.ts             # Root component
│   ├── index.html
│   ├── main.ts                          # Bootstrap standalone
│   └── styles.scss
└── tsconfig.app.json
```

## 🎯 Main Component: API Example

Demonstrates a complete user management system with:

- **User List** - Display all users with CRUD operations
- **Add User** - Create new users via modal form
- **Edit User** - Update existing users
- **Delete User** - Remove users with confirmation
- **Modal Form** - JSF form integrated in Bootstrap modal

### User Modal Component

The modal contains a comprehensive JSF form organized in **7 tabs**:

1. **Basic Information**
   - User ID (read-only)
   - Full Name, Username, Email
   - Age, Role (dropdown), Status (radio buttons)
   - Phone, Website
   - Newsletter subscription, Notifications, Two-Factor Auth

2. **Address**
   - Street, Suite/Apartment
   - City, Zip Code
   - Country (dropdown)
   - GPS Coordinates (latitude, longitude)

3. **Company**
   - Company Name
   - Job Title, Department (dropdown)
   - Catchphrase, Business Strategy
   - Employment Type (radio buttons)
   - Start Date, End Date (conditional)

4. **Skills & Experience**
   - Programming Languages (checkboxes)
   - Years of Experience (number)
   - Certifications (array of items)
   - Projects Portfolio (array of items)

5. **Preferences**
   - Theme (dropdown)
   - Language (dropdown)
   - Timezone
   - Date Format, Time Format (radio buttons)
   - Enable Features (checkboxes with children)

6. **Social Media**
   - LinkedIn, Twitter, GitHub
   - Portfolio URL
   - Blog URL

7. **Security**
   - Password (secured input)
   - Confirm Password (secured input)
   - Security Question (dropdown)
   - Security Answer (secured input)
   - API Keys (array of secured items)

## 🔧 Technologies

- **Angular 20.3.16**
- **TypeScript 5.8.3**
- **Signals API** for reactive state
- **Standalone Components**
- **JSF Library** (JSON Schema Form)
- **Bootstrap 5** for styling

## 🎨 JSF Features Demonstrated

### All Input Types

- ✅ Text inputs (name, email, phone, URLs)
- ✅ Number inputs (age, years of experience)
- ✅ Dropdowns (role, country, department, theme)
- ✅ Radio button groups (status, employment type, date format)
- ✅ Checkboxes (newsletter, notifications, 2FA)
- ✅ Checkboxes with children (enable features with nested options)
- ✅ Text areas (catchphrase, business strategy)
- ✅ Secured inputs (passwords, security answers, API keys)
- ✅ Read-only fields (user ID)
- ✅ Date inputs (start date, end date)

### Advanced Features

- ✅ **Tabs Organization** - 7 tabs for logical grouping
- ✅ **Conditional Fields** - End date shows only when employment is "Former"
- ✅ **Nested Checkboxes** - Checkboxes with child properties
- ✅ **Arrays** - Certifications, Projects, API Keys with add/remove
- ✅ **Nested Objects** - Address, Company, GPS Coordinates
- ✅ **Validations**:
  - Required fields
  - Min/Max length
  - Min/Max values
  - Pattern validation (email, phone, username)
  - Format validation (email, URI, date)
- ✅ **Help Text & Tooltips**
- ✅ **Placeholders**
- ✅ **Default Values**

## 🎨 Signals Implementation

### API Service with Signals

```typescript
export class ApiService {
  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  loadUsers() {
    this.isLoading.set(true);
    // ... fetch users logic
  }

  addUser(user: User) {
    // ... create user logic
  }

  updateUser(id: number, user: User) {
    // ... update user logic
  }

  deleteUser(id: number) {
    // ... delete user logic
  }
}
```

### Component with Signals

```typescript
export class ApiExampleComponent {
  showModal = signal<boolean>(false);
  editingUserId = signal<number | null>(null);
  userToEdit = signal<User | null>(null);

  // Access service signals
  users = this.apiService.users;
  isLoading = this.apiService.isLoading;
  error = this.apiService.error;

  showAddForm() {
    this.showModal.set(true);
  }

  editUser(user: User) {
    this.editingUserId.set(user.id);
    this.userToEdit.set(user);
    this.showModal.set(true);
  }
}
```

## 🌟 Benefits of Signals

1. **Automatic Reactivity** - No need for `ChangeDetectorRef`
2. **Better Performance** - Granular updates
3. **Cleaner Code** - Less boilerplate
4. **Type-Safe** - Full TypeScript support
5. **Computed Values** - Automatic derived values
6. **Easy Debugging** - Clear state management

## 📚 Learning from This Demo

This demo is perfect for:

### Beginners
- See a complete working example of JSF
- Understand how to integrate JSF in Angular 20
- Learn Signals-based state management
- Study the schema structure

### Advanced Users
- Reference for complex schema configurations
- Example of CRUD operations with JSF
- Modal integration patterns
- Best practices for form validation

## 📝 How to Use the Schema

### Copy Field Patterns

The schema file contains examples for every field type. Copy and adapt:

```json
{
  "email": {
    "type": "string",
    "name": "Email",
    "format": "email",
    "helpText": "Valid email address",
    "placeholder": "e.g., john@example.com"
  }
}
```

### Dropdown Example

```json
{
  "role": {
    "display": "dropdown",
    "name": "User Role",
    "enum": ["admin", "user", "guest"],
    "enumNames": ["Administrator", "Regular User", "Guest"]
  }
}
```

### Array Example

```json
{
  "certifications": {
    "type": "array",
    "name": "Certifications",
    "items": {
      "type": "object",
      "properties": {
        "name": { "type": "string", "name": "Certificate Name" },
        "year": { "type": "integer", "name": "Year Obtained" }
      }
    }
  }
}
```

## 🛠️ Development

### Serve

```bash
ng serve jsf-demo
```

### Build

```bash
ng build jsf-demo
```

### Test

```bash
ng test jsf-demo
```

## 📝 Notes

- This is a clean demonstration project
- Uses modern Angular 20 architecture with Signals
- No NgModules (100% standalone)
- Complete schema with 700+ lines demonstrating all JSF features
**Happy Coding!** 🚀
