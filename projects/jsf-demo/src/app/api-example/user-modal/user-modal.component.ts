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
      // Force recreation of schema data for new user (without security tab)
      const createSchema = this.getSchemaForCreating();
      this.schemaData.set(
        new JSFSchemaData(createSchema, JSON.parse(JSON.stringify(values))),
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
