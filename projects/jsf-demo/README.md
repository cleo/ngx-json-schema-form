# JSF Demo - Angular 20 with Signals

Demo moderno de la librería JSF (JSON Schema Form) usando **Angular 20** con **Signals** para manejo de estado reactivo.

## 🚀 Características

- ✅ **Angular 20** con arquitectura standalone
- ✅ **Signals** para estado reactivo
- ✅ **Componente API Example** - CRUD completo con JSONPlaceholder API
- ✅ Sin NgModules (arquitectura completamente standalone)
- ✅ Configuración moderna con `ApplicationConfig`
- ✅ Lazy loading de rutas

## 🎯 Quick Start

### Run the Demo

```bash
# From the root of the workspace
ng serve jsf-demo
```

# JSF Demo - Angular 20 with Signals

Demo moderno de la librería JSF (JSON Schema Form) usando **Angular 20** con **Signals** para manejo de estado reactivo.

## 🚀 Características

- ✅ **Angular 20** con arquitectura standalone
- ✅ **Signals** para estado reactivo
- ✅ **Múltiples componentes** demostrando todas las características de JSF
- ✅ **Integración completa con JSONPlaceholder API** (Users, Posts, Albums, Todos, Comments, Photos)
- ✅ Sin NgModules (arquitectura completamente standalone)
- ✅ Configuración moderna con `ApplicationConfig`
- ✅ Lazy loading de rutas

## 📁 Estructura del Proyecto

```
jsf-demo/
├── src/
│   ├── app/
│   │   ├── api-example/              # Lista de usuarios (CRUD básico)
│   │   │   ├── api-example.component.ts
│   │   │   ├── api-example.component.html
│   │   │   └── api-example.component.scss
│   │   ├── user-details/             # Vista completa con Posts, Albums, Todos
│   │   │   ├── user-details.component.ts
│   │   │   ├── user-details.component.html
│   │   │   └── user-details.component.scss
│   │   ├── services/
│   │   │   └── api.service.ts        # Servicio con signals (todos los recursos)
│   │   ├── app.config.ts             # Configuración standalone
│   │   ├── app.routes.ts             # Rutas con lazy loading
│   │   └── app.component.ts          # Root component standalone
│   ├── index.html
│   ├── main.ts                       # Bootstrap standalone
│   └── styles.scss
```

## 🎯 Componentes y Funcionalidades

### 1. **API Example Component** (`/`)
Demuestra:
- **Integración con API REST** (JSONPlaceholder)
- **CRUD completo de Usuarios** (Create, Read, Update, Delete)
- **Signals** para estado reactivo
- **Navegación** a vista de detalles

### 2. **User Details Component** (`/user/:id`)
Vista completa con **TODAS las características de JSF**:

#### 📊 Recursos de JSONPlaceholder integrados:
- ✅ **Posts** del usuario (100 posts por usuario)
- ✅ **Albums** del usuario (100 albums por usuario)
- ✅ **Todos** del usuario (200 todos por usuario)
- ✅ **Comments** relacionados (500 comments disponibles)
- ✅ **Photos** de albums (5000 photos disponibles)

#### 🎨 Características JSF Demostradas:

**Arrays/Collections:**
- ✅ Array de Posts (con add/remove items)
- ✅ Array de Albums (con add/remove items)
- ✅ Array de Todos (con add/remove items)
- ✅ Validaciones en arrays (minLength, maxLength, required items)

**Tipos de Campos:**
- ✅ Text inputs (name, username, email, phone, website)
- ✅ Textarea (post body con minLength/maxLength)
- ✅ Boolean/Checkbox (todo completed status)
- ✅ Read-only fields (IDs, timestamps)
- ✅ Email validation (formato de email)
- ✅ Number fields (user ID, post ID, etc)

**Objetos Anidados:**
- ✅ User Info (nombre, username, email, etc)
- ✅ Address (street, suite, city, zipcode)
- ✅ GPS Coordinates (lat, lng)
- ✅ Company (name, catchPhrase, bs)

**Validaciones:**
- ✅ Required fields
- ✅ MinLength/MaxLength
- ✅ Email format
- ✅ Pattern validation
- ✅ Custom validations

**UI Features:**
- ✅ Multiple sections/tabs
- ✅ Collapsible sections
- ✅ Section dividers
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

## 🔧 Tecnologías

- **Angular 20.3.16**
- **TypeScript 5.8.3**
- **Signals API** para estado reactivo
- **Standalone Components**
- **JSF Library** (JSON Schema Form)
- **JSONPlaceholder API** para datos de demo

## 📦 Desarrollo

### Iniciar servidor de desarrollo

```bash
# Desde la raíz del workspace
ng serve jsf-demo
```

El proyecto estará disponible en `http://localhost:4200`

### Build para producción

```bash
ng build jsf-demo --configuration=production
```

## 🎨 Características de Signals

### ApiService con Signals

```typescript
export class ApiService {
  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  usersCount = computed(() => this.users().length);
  hasUsers = computed(() => this.users().length > 0);
}
```

### Componente con Signals

```typescript
export class ApiExampleComponent {
  showForm = signal<boolean>(false);
  editingUserId = signal<number | null>(null);
  
  isFormVisible = computed(() => this.showForm());
  isEditing = computed(() => this.editingUserId() !== null);
  
  users = this.apiService.users;
  isLoading = this.apiService.isLoading;
}
```

## 📚 API JSONPlaceholder Recursos

El demo utiliza **TODOS** los recursos disponibles:

| Recurso | Cantidad | Uso en el Demo |
|---------|----------|----------------|
| `/users` | 10 | Lista principal y CRUD |
| `/posts` | 100 | Array editable por usuario |
| `/albums` | 100 | Array editable por usuario |
| `/todos` | 200 | Array editable con checkbox |
| `/comments` | 500 | Disponible para extensión |
| `/photos` | 5000 | Disponible para extensión |

## 🌟 Ventajas de la Arquitectura

1. **Performance Mejorada** - Actualizaciones granulares con signals
2. **Código más Limpio** - Sin `ChangeDetectorRef` ni subscripciones manuales
3. **Type-Safe** - TypeScript completo
4. **Reactividad Automática** - Computed values se actualizan solos
5. **Arquitectura Moderna** - 100% standalone, sin NgModules
6. **Escalable** - Fácil agregar más recursos y componentes

## 🚀 Próximas Extensiones

Ideas para expandir aún más el demo:
- [ ] Componente para Comments con relación a Posts
- [ ] Galería de Photos con relación a Albums
- [ ] Filtros y búsqueda avanzada
- [ ] Paginación de datos
- [ ] Gráficos y estadísticas
- [ ] Drag & Drop para reordenar items
- [ ] File upload simulation
- [ ] Advanced conditional fields

## 🔗 Enlaces

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com)
- [JSF Library](https://www.npmjs.com/package/jsf)


## 📁 Estructura del Proyecto

```
jsf-demo/
├── src/
│   ├── app/
│   │   ├── api-example/          # Componente principal con signals
│   │   │   ├── api-example.component.ts
│   │   │   ├── api-example.component.html
│   │   │   └── api-example.component.scss
│   │   ├── services/
│   │   │   └── api.service.ts    # Servicio con signals
│   │   ├── app.config.ts          # Configuración standalone
│   │   ├── app.routes.ts          # Rutas con lazy loading
│   │   └── app.component.ts       # Root component standalone
│   ├── index.html
│   ├── main.ts                    # Bootstrap standalone
│   └── styles.scss
└── tsconfig.app.json
```

## 🎯 Componente API Example

Demuestra:
- **Integración con API REST** (JSONPlaceholder)
- **CRUD completo** (Create, Read, Update, Delete)
- **Signals** para estado reactivo
- **JSF Form** con todas las características:
  - Tabs
  - Checkboxes con hijos
  - Dropdowns y Radio buttons
  - Arrays con modal editable
  - Inputs seguros (contraseñas)
  - Validaciones
  - Campos condicionales

## 🔧 Tecnologías

- **Angular 20.3.16**
- **TypeScript 5.8.3**
- **Signals API** para estado reactivo
- **Standalone Components**
- **JSF Library** (JSON Schema Form)
- **JSONPlaceholder API** para demos

## 🎨 Características de Signals

### ApiService con Signals

```typescript
export class ApiService {
  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  usersCount = computed(() => this.users().length);
  hasUsers = computed(() => this.users().length > 0);
}
```

### Componente con Signals

```typescript
export class ApiExampleComponent {
  showForm = signal<boolean>(false);
  editingUserId = signal<number | null>(null);
  
  isFormVisible = computed(() => this.showForm());
  isEditing = computed(() => this.editingUserId() !== null);
  
  users = this.apiService.users;
  isLoading = this.apiService.isLoading;
}
```

## 🌟 Ventajas de Signals

1. **Reactividad Automática** - No necesitas `ChangeDetectorRef`
2. **Mejor Performance** - Actualizaciones granulares
3. **Código más Limpio** - Menos boilerplate
4. **Type-Safe** - TypeScript completo
5. **Computed Values** - Valores derivados automáticos

## 📝 Notas

- Este es un proyecto de demostración limpio sin ejemplos innecesarios
- Solo contiene el componente `api-example` con funcionalidad completa
- Usa arquitectura moderna de Angular 20 con signals
- No usa NgModules (100% standalone)

## 🔗 Enlaces

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com)

### Available Routes

- **`/`** - Home page with overview and navigation
- **`/simple-example`** - Simple contact form (beginner-friendly)
- **`/example-use`** - Comprehensive employee registration form (all features)

## 📁 Project Structure

```
projects/jsf-demo/
├── src/
│   ├── app/
│   │   ├── home/                          # Home page component
│   │   ├── simple-example/                # Simple contact form
│   │   │   ├── simple-example-schema.json
│   │   │   ├── simple-example-data.json
│   │   │   └── simple-example.component.*
│   │   ├── comprehensive-example/         # Employee registration form
│   │   │   ├── comprehensive-example-schema.json
│   │   │   ├── comprehensive-example-data.json
│   │   │   └── comprehensive-example.component.*
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.*
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.scss
│   └── test.ts
├── karma.conf.js
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md (this file)
```

## 🎯 Examples Included

### 1. Simple Contact Form (`/simple-example`)

**Perfect for beginners!**

- 8 basic fields
- Text, email, dropdown, radio, checkbox, textarea
- Simple validation
- Clean, easy-to-understand schema

**Use this to learn:**
- Basic field configuration
- Simple validation rules
- Help text and placeholders
- Form data binding

### 2. Employee Registration Form (`/example-use`)

**Complete, real-world example!**

- 50+ fields across 8 tabs
- All available input types
- Conditional fields
- Advanced validation
- Read-only and secured fields

**Use this to learn:**
- Tabs organization
- Conditional/hierarchical fields
- Complex validation patterns
- All field types and configurations
- Real-world form structure

## 🔧 Key Features Demonstrated

### All Input Types

- ✅ Text inputs (basic, email, phone, date)
- ✅ Number inputs (salary, percentages)
- ✅ Dropdowns with various configurations
- ✅ Radio button groups
- ✅ Checkboxes (simple and with children)
- ✅ Text areas with character limits
- ✅ Secured inputs (password-style)
- ✅ Read-only fields
- ✅ Hidden fields

### Validation

- Pattern validation (email, phone, SSN)
- Min/Max length
- Min/Max values
- Required fields
- Format validation (email, date)

### User Experience

- Help text with info icons
- Tooltips on labels
- Placeholder examples
- Default values
- Error messages

### Organization

- Tabs for multi-section forms
- Conditional fields (checkbox with children)
- Nested structures
- Logical grouping

## 📚 Documentation

All examples have complete documentation available in:

- **EXAMPLES-INDEX.md** - Central guide to all examples (bilingual)
- **QUICK-REFERENCE.md** - Code snippets and patterns
- **VISUAL-GUIDE.md** - Visual representation of field types
- **COMPREHENSIVE-EXAMPLE-README.md** - Full documentation (English)
- **EJEMPLO-COMPLETO-README.md** - Full documentation (Spanish)

These files are located in `projects/jsf-launcher/src/app/`

## 🛠️ Development

### Build

```bash
ng build jsf-demo
```

### Test

```bash
ng test jsf-demo
```

### Lint

```bash
ng lint jsf-demo
```

## 📝 How to Use These Examples

### Copy Schema Patterns

1. Open the schema files (`.json`)
2. Find the field type you need
3. Copy the configuration
4. Adapt to your use case

### Example: Add a Text Field

```json
{
  "firstName": {
    "type": "string",
    "name": "First Name",
    "helpText": "Enter your first name",
    "placeholder": "e.g., John",
    "minLength": 2,
    "maxLength": 50
  }
}
```

### Example: Add a Dropdown

```json
{
  "country": {
    "display": "dropdown",
    "name": "Country",
    "enum": ["us", "uk", "ca"],
    "enumNames": ["United States", "United Kingdom", "Canada"]
  }
}
```

### Example: Conditional Fields

```json
{
  "enableFeature": {
    "type": "object",
    "isConditional": true,
    "name": "Enable Feature",
    "properties": {
      "featureConfig": {
        "type": "string",
        "name": "Configuration"
      }
    }
  }
}
```

## 🎓 Learning Path

### For Beginners

1. Start at the home page (`/`)
2. Read the overview
3. Go to Simple Example (`/simple-example`)
4. Study the schema and form behavior
5. Try modifying the schema

### For Advanced Users

1. Go directly to Employee Registration (`/example-use`)
2. Explore all tabs
3. Study the schema file
4. Review conditional fields
5. Check validation patterns
6. Adapt for your use case

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📦 Dependencies

This application uses:

- **Angular** (check package.json for version)
- **ngx-json-schema-form** (jsf library from this workspace)
- **RxJS**
- **TypeScript**

## 🤝 Contributing

To add new examples:

1. Create schema and data JSON files
2. Create a new component
3. Add route in `app-routing.module.ts`
4. Add navigation link in `app.component.html`
5. Update this README

## 📞 Support

For questions or issues:

1. Check the documentation files
2. Review the existing examples
3. Examine the schema files
4. Check the main library README

## 🎉 Credits

This demo application is part of the **ngx-json-schema-form** library project.

---

**Happy Coding!** 🚀

Visit the home page to get started: http://localhost:4200
