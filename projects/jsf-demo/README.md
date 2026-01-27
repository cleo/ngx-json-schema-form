# JSF Demo - Angular 20 with Signals

Modern demo of the JSF library (JSON Schema Form) using **Angular 20** with **Signals** for reactive state management.

## 🚀 Features

- ✅ **Angular 20** with standalone architecture
- ✅ **Signals** for reactive state management
- ✅ No NgModules (100% standalone architecture)
- ✅ Modern configuration with `ApplicationConfig`
- ✅ Complete CRUD example with modal forms
- ✅ Comprehensive JSF schema with all user management features
- ✅ Automatic fake data generation for testing

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
│   │   ├── api-example-data.json        # Initial data structure
│   │   ├── app.config.ts                # Standalone config
│   │   ├── app.routes.ts                # Routes
│   │   └── app.component.ts             # Root component
│   ├── index.html
│   ├── main.ts                          # Bootstrap standalone
│   └── styles.scss
└── tsconfig.app.json
```

## 📋 User Modal Component

The modal contains a comprehensive JSF form organized in **8 tabs**:

1. **Basic Information**
   - Full Name, Username, Email
   - Age, Role (dropdown), Status (radio buttons)
   - Phone, Website
   - Newsletter subscription, Notifications, Two-Factor Auth

2. **Address**
   - Street, Suite/Apartment
   - City, Zip Code, Country (dropdown)
   - GPS Coordinates (latitude, longitude)

3. **Contact Preferences**
   - Preferred Contact Method (OneOf: Email, Phone, SMS)
   - Emergency Contacts (array)

4. **Company**
   - Works at a Company (checkbox)
   - Company Details (conditional)
   - Name, Position, Department (dropdown)
   - Years of Experience
   - Catchphrase, Business Description

5. **Skills & Projects**
   - Primary Technical Skills (array with dropdown levels)
   - Spoken Languages (array with proficiency levels)

6. **Security & Privacy**
   - Password (secured input)
   - API Key (secured input)
   - Secret Token (read-only secured)
   - Privacy Settings (profile visibility, show email, allow messages)

7. **Preferences & Settings**
   - Theme (radio buttons), Language, Timezone (dropdowns)
   - Notification Preferences (conditional object)
   - Advanced Settings (conditional object)

8. **System Information**
   - Account Created, Last Login (read-only)
   - Account Type, Subscription Level (read-only)

## 🎨 JSF Features Demonstrated

### All Input Types

- ✅ Text inputs (name, email, phone, URLs)
- ✅ Number inputs (age, years of experience)
- ✅ Dropdowns (role, country, department, theme, language)
- ✅ Radio button groups (status, theme)
- ✅ Checkboxes (newsletter, notifications, 2FA, privacy settings)
- ✅ Text areas (catchphrase, business description)
- ✅ Secured inputs (passwords, API keys, tokens)
- ✅ Read-only fields (user ID, account info)

### Advanced Features

- ✅ **Tabs Organization** - 8 tabs for logical grouping
- ✅ **OneOf Fields** - Preferred contact method with different schemas
- ✅ **Conditional Fields** - Company details, notification preferences
- ✅ **Arrays with AG-Grid** - Skills, languages, emergency contacts
- ✅ **Nested Objects** - Address, Company, Privacy Settings
- ✅ **Automatic Fake Data Generation** - Creates random test data on new user
- ✅ **Validations**:
  - Required fields
  - Min/Max length (name, password)
  - Min/Max values (age)
  - Pattern validation (email, phone, username)
  - Format validation (email, URI)
- ✅ **Help Text & Tooltips**
- ✅ **Placeholders**
- ✅ **Default Values**

## 🎲 Fake Data Generation

When creating a new user, the form automatically generates realistic fake data:

- Random names (Spanish/English)
- Valid email addresses and usernames
- Phone numbers in US format
- Random addresses with GPS coordinates
- Skills and languages with proficiency levels
- Company information
- Timestamps and account types

## 🔧 Technologies

- **Angular 20.3.16**
- **TypeScript 5.8.3**
- **Signals API** for reactive state
- **Standalone Components**
- **JSF Library** (JSON Schema Form)
- **AG-Grid** for array tables


## 📝 Notes

- This is a demonstration project for JSF capabilities
- Uses modern Angular 20 architecture with Signals
- 100% standalone components (no NgModules)
- Complete schema demonstrating all JSF features
- Includes CRUD operations with modal forms
- Automatic fake data generation for testing

**Happy Coding!** 🚀
