import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { JSFConfig, JSFSchemaData } from "jsf";
import { JSFComponent, JSFModule } from "jsf";
import { User } from "../../services/api.service";
import schema from "../../api-example-schema.json";
import values from "../../api-example-data.json";

@Component({
  selector: "app-user-modal",
  standalone: true,
  imports: [CommonModule, JSFModule],
  templateUrl: "./user-modal.component.html",
  styleUrls: ["./user-modal.component.scss"],
})
export class UserModalComponent implements OnChanges {
  @ViewChild(JSFComponent, { static: false }) jsfComponent!: JSFComponent;

  @Input() show = false;
  @Input() user: User | null = null;
  @Input() isLoading = false;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  schemaData = signal<JSFSchemaData>(new JSFSchemaData(schema, values));
  currentFormData = signal<any>(null);
  isSubmitDisabled = false;

  config: JSFConfig = {
    enableCollapsibleSections: false,
    showSectionDivider: true,
    expandOuterSectionsByDefault: true
  };

  get isEditing(): boolean {
    return this.user !== null && this.user.id !== undefined;
  }

  get modalTitle(): string {
    return this.isEditing ? "✏️ Edit User" : "➕ New User";
  }

  get submitButtonText(): string {
    return this.isEditing ? "💾 Update User" : "➕ Create User";
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.show && this.show) {
      this.resetForm();
    }

    if (changes.user && this.user) {
      const formData = this.mapUserToFormData(this.user);
      // Force recreation of schema data with all tabs for editing
      const editSchema = this.getSchemaForEditing();
      this.schemaData.set(new JSFSchemaData(editSchema, formData));
    }
  }

  resetForm() {
    if (!this.user) {
      // Force recreation of schema data for new user
      const createSchema = this.getSchemaForCreating();
      const fakeData = this.generateFakeUserData();
      this.schemaData.set(
        new JSFSchemaData(createSchema, fakeData),
      );
    }
    this.currentFormData.set(null);
    this.isSubmitDisabled = false;
  }

  private getSchemaForCreating() {
    // Clone schema for creating new user
    return JSON.parse(JSON.stringify(schema));
  }

  private getSchemaForEditing(): any {
    // Clone schema for editing existing user
    return JSON.parse(JSON.stringify(schema));
  }

  private generateFakeUserData(): any {
    // Arrays for random data generation
    const firstNames = ['Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Elena', 'Pedro', 'Sofia', 'Miguel', 'Laura'];
    const lastNames = ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores'];
    const roles = ['admin', 'user', 'moderator', 'guest'];
    const departments = ['engineering', 'sales', 'marketing', 'hr', 'finance', 'operations'];
    const skills = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'Go'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];
    const countries = ['usa', 'canada', 'mexico', 'uk', 'germany', 'france'];
    const cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Malaga', 'Zaragoza', 'Murcia'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
    const email = `${username}@example.com`;
    const age = Math.floor(Math.random() * 40) + 20;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    const recentDate = new Date(now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

    // Build the complete object directly
    return {
      basicInfo: {
        name: fullName,
        username: username,
        email: email,
        age: age,
        role: role,
        status: 'active',
        phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        website: `https://www.${username}.com`,
        newsletter: Math.random() > 0.5
      },
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} Main St`,
        suite: `Apt ${Math.floor(Math.random() * 50) + 1}`,
        city: city,
        zipcode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: country,
        geo: {
          lat: (Math.random() * 180 - 90).toFixed(4),
          lng: (Math.random() * 360 - 180).toFixed(4)
        }
      },
      contact: {
        preferredContact: (() => {
          const contactMethods = [
            {
              emailAddress: email,
              emailFrequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)]
            },
            {
              phoneNumber: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
              bestTimeToCall: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)]
            },
            {
              smsNumber: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
            }
          ];
          return contactMethods[Math.floor(Math.random() * contactMethods.length)];
        })(),
        emergencyContacts: [
          {
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)]
          }
        ]
      },
      company: {
        hasCompany: Math.random() > 0.3,
        companyDetails: {
          name: `${lastNames[Math.floor(Math.random() * lastNames.length)]} Corp`,
          position: ['Software Engineer', 'Manager', 'Director', 'Consultant'][Math.floor(Math.random() * 4)],
          department: departments[Math.floor(Math.random() * departments.length)],
          yearsOfExperience: Math.floor(Math.random() * 20) + 1,
          catchPhrase: 'Innovation through technology',
          bs: 'Providing cutting-edge solutions'
        }
      },
      skills: {
        primarySkills: [
          {
            skill: skills[Math.floor(Math.random() * skills.length)],
            level: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)],
            yearsExperience: Math.floor(Math.random() * 10) + 1,
            certified: Math.random() > 0.6
          }
        ],
        languages: [
          {
            language: languages[Math.floor(Math.random() * languages.length)],
            proficiency: ['basic', 'conversational', 'fluent', 'native'][Math.floor(Math.random() * 4)]
          }
        ]
      },
      security: {
        password: `Pass${Math.floor(Math.random() * 10000)}!`,
        apiKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        secretToken: 'hidden_token_value',
        privacySettings: {
          profileVisibility: ['public', 'friends', 'private'][Math.floor(Math.random() * 3)],
          showEmail: Math.random() > 0.5,
          allowMessages: Math.random() > 0.3
        }
      },
      preferences: {
        theme: ['light', 'dark', 'auto'][Math.floor(Math.random() * 3)],
        language: ['en', 'es', 'fr', 'de', 'pt'][Math.floor(Math.random() * 5)],
        timezone: ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'][Math.floor(Math.random() * 6)],
        notificationPreferences: {
          emailDigest: ['daily', 'weekly', 'monthly', 'never'][Math.floor(Math.random() * 4)],
          pushNotifications: Math.random() > 0.5,
          smsAlerts: Math.random() > 0.7
        },
        advancedSettings: {
          debugMode: Math.random() > 0.8,
          autoSave: Math.random() > 0.3,
          maxConcurrentSessions: Math.floor(Math.random() * 5) + 1
        }
      },
      readOnlyInfo: {
        accountCreated: pastDate.toISOString(),
        lastLogin: recentDate.toISOString(),
        accountType: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        subscriptionLevel: ['Free Plan', 'Basic Plan', 'Pro Plan', 'Enterprise Plan'][Math.floor(Math.random() * 4)]
      }
    };
  }

  onSave() {
    let formData = this.currentFormData();

    if (!formData && this.jsfComponent) {
      formData = this.jsfComponent.getFormValues();
    }

    if (!formData) {
      formData = this.schemaData().values;
    }

    if (!formData) {
      return;
    }

    const user = this.mapFormDataToUser(formData);

    if (this.user?.id) {
      user.id = this.user.id;
    }

    this.save.emit(user);
  }

  onCancel() {
    this.cancel.emit();
  }

  onDataChange(data: any) {
    this.currentFormData.set(data);
  }

  onDisableSubmit(disabled: boolean) {
    this.isSubmitDisabled = disabled;
  }

  onFormHeightChange(height: number) {}

  private mapUserToFormData(user: User): any {
    return {
      basicInfo: {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        age: user.age || null,
        role: user.role || "",
        status: user.status || "active",
        phone: user.phone || "",
        website: user.website || "",
        newsletter: user.newsletter || false,
        emailNotifications: user.emailNotifications || false,
        twoFactorAuth: user.twoFactorAuth || false,
      },
      address: {
        street: user.address?.street || "",
        suite: user.address?.suite || "",
        city: user.address?.city || "",
        zipcode: user.address?.zipcode || "",
        country: user.address?.country || "",
        geo: {
          lat: user.address?.geo?.lat || "",
          lng: user.address?.geo?.lng || "",
        },
      },
      contact: {
        preferredContact: user.contact?.preferredContact || {},
        emergencyContacts: user.contact?.emergencyContacts || [],
      },
      company: {
        hasCompany: !!user.company,
        companyDetails: user.company
          ? {
              name: user.company.name || "",
              position: user.company.position || "",
              department: user.company.department || "",
              yearsOfExperience: user.company.yearsOfExperience || null,
              catchPhrase: user.company.catchPhrase || "",
              bs: user.company.bs || "",
            }
          : {
              name: "",
              position: "",
              department: "",
              yearsOfExperience: null,
              catchPhrase: "",
              bs: "",
            },
      },
      skills: {
        primarySkills:
          user.skills?.primarySkills && user.skills.primarySkills.length > 0
            ? user.skills.primarySkills
            : [
                {
                  skill: "",
                  level: "intermediate",
                  yearsExperience: 0,
                  certified: false,
                },
              ],
        languages:
          user.skills?.languages && user.skills.languages.length > 0
            ? user.skills.languages
            : [{ language: "", proficiency: "conversational" }],
      },
      security: {
        password: user.security?.password || "",
        apiKey: user.security?.apiKey || "",
        secretToken: user.security?.secretToken || "",
        privacySettings: {
          profileVisibility: user.security?.privacySettings?.profileVisibility || "friends",
          showEmail: user.security?.privacySettings?.showEmail || false,
          allowMessages: user.security?.privacySettings?.allowMessages || true,
        },
      },
      preferences: {
        theme: user.preferences?.theme || "auto",
        language: user.preferences?.language || "en",
        timezone: user.preferences?.timezone || "UTC",
        notificationPreferences: user.preferences?.notificationPreferences || {
          emailDigest: "weekly",
          pushNotifications: false,
          smsAlerts: false,
        },
        advancedSettings: user.preferences?.advancedSettings || {
          debugMode: false,
          autoSave: true,
          maxConcurrentSessions: 3,
        },
      },
      readOnlyInfo: {
        accountCreated: user.readOnlyInfo?.accountCreated || new Date().toISOString(),
        lastLogin: user.readOnlyInfo?.lastLogin || new Date().toISOString(),
        accountType: user.readOnlyInfo?.accountType || "Standard",
        subscriptionLevel: user.readOnlyInfo?.subscriptionLevel || "Free Plan",
      },
    };
  }

  private mapFormDataToUser(formData: any): User {
    const user: User = {
      name: formData.basicInfo?.name || "",
      email: formData.basicInfo?.email || "",
      username: formData.basicInfo?.username || "",
      age: formData.basicInfo?.age || undefined,
      role: formData.basicInfo?.role || undefined,
      status: formData.basicInfo?.status || "active",
      phone: formData.basicInfo?.phone || "",
      website: formData.basicInfo?.website || "",
      newsletter: formData.basicInfo?.newsletter || false,
      emailNotifications: formData.basicInfo?.emailNotifications || false,
      twoFactorAuth: formData.basicInfo?.twoFactorAuth || false,
    };

    if (formData.address) {
      user.address = {
        street: formData.address.street || "",
        suite: formData.address.suite || "",
        city: formData.address.city || "",
        zipcode: formData.address.zipcode || "",
        country: formData.address.country || undefined,
      };

      if (
        formData.address.geo &&
        (formData.address.geo.lat || formData.address.geo.lng)
      ) {
        user.address.geo = {
          lat: formData.address.geo.lat || "",
          lng: formData.address.geo.lng || "",
        };
      }
    }

    if (formData.contact) {
      user.contact = {
        preferredContact: formData.contact.preferredContact || undefined,
        emergencyContacts: formData.contact.emergencyContacts || [],
      };
    }

    if (formData.company?.hasCompany && formData.company.companyDetails) {
      user.company = {
        name: formData.company.companyDetails.name || "",
        position: formData.company.companyDetails.position || undefined,
        department: formData.company.companyDetails.department || undefined,
        yearsOfExperience:
          formData.company.companyDetails.yearsOfExperience || undefined,
        catchPhrase: formData.company.companyDetails.catchPhrase || "",
        bs: formData.company.companyDetails.bs || "",
      };
    }

    if (formData.skills) {
      user.skills = {
        primarySkills: formData.skills.primarySkills || [],
        languages: formData.skills.languages || [],
      };
    }

    if (formData.security) {
      user.security = {
        password: formData.security.password || undefined,
        apiKey: formData.security.apiKey || undefined,
        secretToken: formData.security.secretToken || undefined,
        privacySettings: formData.security.privacySettings || undefined,
      };
    }

    if (formData.preferences) {
      user.preferences = {
        theme: formData.preferences.theme || undefined,
        language: formData.preferences.language || undefined,
        timezone: formData.preferences.timezone || undefined,
        notificationPreferences: formData.preferences.notificationPreferences || undefined,
        advancedSettings: formData.preferences.advancedSettings || undefined,
      };
    }

    if (formData.readOnlyInfo) {
      user.readOnlyInfo = {
        accountCreated: formData.readOnlyInfo.accountCreated || undefined,
        lastLogin: formData.readOnlyInfo.lastLogin || undefined,
        accountType: formData.readOnlyInfo.accountType || undefined,
        subscriptionLevel: formData.readOnlyInfo.subscriptionLevel || undefined,
      };
    }

    return user;
  }
}
