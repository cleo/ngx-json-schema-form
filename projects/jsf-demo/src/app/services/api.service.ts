import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  name: string;
  email: string;
  username?: string;
  age?: number;
  role?: string;
  status?: string;
  phone?: string;
  website?: string;
  newsletter?: boolean;
  emailNotifications?: boolean;
  twoFactorAuth?: boolean;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    country?: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  contact?: {
    preferredContact?: any;
    emergencyContacts?: Array<{
      name: string;
      relationship: string;
      phone: string;
    }>;
  };
  company?: {
    name: string;
    position?: string;
    department?: string;
    yearsOfExperience?: number;
    catchPhrase: string;
    bs: string;
  };
  skills?: {
    primarySkills?: Array<{
      skill: string;
      level: string;
      yearsExperience: number;
      certified: boolean;
    }>;
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  security?: {
    password?: string;
    apiKey?: string;
    secretToken?: string;
    privacySettings?: {
      profileVisibility?: string;
      showEmail?: boolean;
      allowMessages?: boolean;
    };
  };
  preferences?: {
    theme?: string;
    language?: string;
    timezone?: string;
    notificationPreferences?: any;
    advancedSettings?: any;
  };
  readOnlyInfo?: {
    accountCreated?: string;
    lastLogin?: string;
    accountType?: string;
    subscriptionLevel?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly STORAGE_KEY = 'jsf-demo-users';

  // Signals for reactive state
  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Computed signals
  usersCount = computed(() => this.users().length);
  hasUsers = computed(() => this.users().length > 0);

  constructor(private http: HttpClient) {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      // Initialize with 5 example users
      const initialUsers: User[] = this.getInitialUsers();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialUsers));
    }
  }

  private getInitialUsers(): User[] {
    return [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        username: 'alice.j',
        age: 28,
        role: 'admin',
        status: 'active',
        phone: '(555)100-2001',
        website: 'https://alice-dev.com',
        newsletter: true,
        emailNotifications: true,
        twoFactorAuth: true,
        address: {
          street: '123 Tech Boulevard',
          suite: 'Suite 100',
          city: 'San Francisco',
          zipcode: '94102',
          country: 'usa',
          geo: { lat: '37.7749', lng: '-122.4194' }
        },
        contact: {
          preferredContact: {
            email: {
              emailAddress: 'alice.johnson@example.com',
              emailFrequency: 'weekly'
            }
          },
          emergencyContacts: [
            { name: 'Bob Johnson', relationship: 'Spouse', phone: '+1-555-100-2002' }
          ]
        },
        company: {
          name: 'Tech Innovators Inc',
          position: 'Senior Software Engineer',
          department: 'engineering',
          yearsOfExperience: 7,
          catchPhrase: 'Innovating the future',
          bs: 'AI-driven solutions for modern businesses'
        },
        skills: {
          primarySkills: [
            { skill: 'TypeScript', level: 'expert', yearsExperience: 5, certified: true },
            { skill: 'Angular', level: 'expert', yearsExperience: 6, certified: true },
            { skill: 'Node.js', level: 'advanced', yearsExperience: 5, certified: false }
          ],
          languages: [
            { language: 'English', proficiency: 'native' },
            { language: 'Spanish', proficiency: 'conversational' }
          ]
        },
        security: {
          password: '********',
          apiKey: 'ak_live_abc123',
          secretToken: 'secret_token_xyz',
          privacySettings: {
            profileVisibility: 'friends',
            showEmail: false,
            allowMessages: true
          }
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/Los_Angeles',
          notificationPreferences: {
            emailDigest: 'weekly',
            pushNotifications: true,
            smsAlerts: false
          },
          advancedSettings: {
            debugMode: false,
            autoSave: true,
            maxConcurrentSessions: 5
          }
        },
        readOnlyInfo: {
          accountCreated: '2023-01-15T10:30:00Z',
          lastLogin: '2026-01-26T08:45:00Z',
          accountType: 'Premium',
          subscriptionLevel: 'Pro Plan'
        }
      },
      {
        id: 2,
        name: 'Carlos Martinez',
        email: 'carlos.m@example.com',
        username: 'carlos_dev',
        age: 35,
        role: 'user',
        status: 'active',
        phone: '(555)200-3001',
        website: 'https://carlosdev.io',
        newsletter: false,
        emailNotifications: true,
        twoFactorAuth: false,
        address: {
          street: '456 Innovation Drive',
          suite: 'Apt 5B',
          city: 'Austin',
          zipcode: '78701',
          country: 'usa',
          geo: { lat: '30.2672', lng: '-97.7431' }
        },
        contact: {
          preferredContact: {
            phone: {
              phoneNumber: '+1-555-200-3001',
              bestTimeToCall: 'afternoon'
            }
          },
          emergencyContacts: [
            { name: 'Maria Martinez', relationship: 'Sister', phone: '+1-555-200-3002' }
          ]
        },
        company: {
          name: 'StartUp Labs',
          position: 'Full Stack Developer',
          department: 'engineering',
          yearsOfExperience: 10,
          catchPhrase: 'Building tomorrow today',
          bs: 'Cloud-native microservices architecture'
        },
        skills: {
          primarySkills: [
            { skill: 'Python', level: 'expert', yearsExperience: 8, certified: true },
            { skill: 'Django', level: 'advanced', yearsExperience: 6, certified: false },
            { skill: 'Docker', level: 'advanced', yearsExperience: 4, certified: true }
          ],
          languages: [
            { language: 'Spanish', proficiency: 'native' },
            { language: 'English', proficiency: 'fluent' },
            { language: 'Portuguese', proficiency: 'basic' }
          ]
        },
        security: {
          password: '********',
          privacySettings: {
            profileVisibility: 'public',
            showEmail: true,
            allowMessages: true
          }
        },
        preferences: {
          theme: 'light',
          language: 'es',
          timezone: 'America/New_York',
          notificationPreferences: {
            emailDigest: 'daily',
            pushNotifications: false,
            smsAlerts: true
          },
          advancedSettings: {
            debugMode: true,
            autoSave: true,
            maxConcurrentSessions: 3
          }
        },
        readOnlyInfo: {
          accountCreated: '2022-08-20T14:20:00Z',
          lastLogin: '2026-01-25T18:30:00Z',
          accountType: 'Standard',
          subscriptionLevel: 'Free Plan'
        }
      },
      {
        id: 3,
        name: 'Emma Williams',
        email: 'emma.w@example.com',
        username: 'emma.williams',
        age: 42,
        role: 'moderator',
        status: 'active',
        phone: '(555)300-4001',
        website: '',
        newsletter: true,
        emailNotifications: false,
        twoFactorAuth: true,
        address: {
          street: '789 Business Park',
          suite: 'Floor 3',
          city: 'Seattle',
          zipcode: '98101',
          country: 'usa'
        },
        contact: {
          preferredContact: {
            sms: {
              smsNumber: '+1-555-300-4001'
            }
          },
          emergencyContacts: []
        },
        company: {
          name: 'Enterprise Solutions Corp',
          position: 'Project Manager',
          department: 'operations',
          yearsOfExperience: 15,
          catchPhrase: 'Excellence in delivery',
          bs: 'Enterprise resource planning and optimization'
        },
        skills: {
          primarySkills: [
            { skill: 'Project Management', level: 'expert', yearsExperience: 12, certified: true },
            { skill: 'Agile/Scrum', level: 'expert', yearsExperience: 10, certified: true }
          ],
          languages: [
            { language: 'English', proficiency: 'native' }
          ]
        },
        security: {
          password: '********',
          secretToken: 'readonly_token',
          privacySettings: {
            profileVisibility: 'private',
            showEmail: false,
            allowMessages: false
          }
        },
        preferences: {
          theme: 'auto',
          language: 'en',
          timezone: 'America/Los_Angeles',
          notificationPreferences: {
            emailDigest: 'monthly',
            pushNotifications: false,
            smsAlerts: false
          },
          advancedSettings: {
            debugMode: false,
            autoSave: false,
            maxConcurrentSessions: 2
          }
        },
        readOnlyInfo: {
          accountCreated: '2021-03-10T09:15:00Z',
          lastLogin: '2026-01-24T16:00:00Z',
          accountType: 'Business',
          subscriptionLevel: 'Enterprise Plan'
        }
      },
      {
        id: 4,
        name: 'David Chen',
        email: 'david.chen@example.com',
        username: 'd.chen',
        age: 26,
        role: 'user',
        status: 'active',
        phone: '(555)400-5001',
        website: 'https://davidchen.blog',
        newsletter: true,
        emailNotifications: true,
        twoFactorAuth: false,
        address: {
          street: '321 Developer Lane',
          suite: '',
          city: 'New York',
          zipcode: '10001',
          country: 'usa',
          geo: { lat: '40.7128', lng: '-74.0060' }
        },
        contact: {
          preferredContact: {
            email: {
              emailAddress: 'david.chen@example.com',
              emailFrequency: 'daily'
            }
          },
          emergencyContacts: [
            { name: 'Lisa Chen', relationship: 'Mother', phone: '+1-555-400-5002' },
            { name: 'Tom Chen', relationship: 'Father', phone: '+1-555-400-5003' }
          ]
        },
        company: {
          name: 'Digital Creatives',
          position: 'Junior Developer',
          department: 'engineering',
          yearsOfExperience: 3,
          catchPhrase: 'Creating digital experiences',
          bs: 'UI/UX focused web development'
        },
        skills: {
          primarySkills: [
            { skill: 'JavaScript', level: 'intermediate', yearsExperience: 3, certified: false },
            { skill: 'React', level: 'intermediate', yearsExperience: 2, certified: false },
            { skill: 'CSS', level: 'advanced', yearsExperience: 3, certified: false }
          ],
          languages: [
            { language: 'English', proficiency: 'fluent' },
            { language: 'Mandarin', proficiency: 'native' }
          ]
        },
        security: {
          password: '********',
          privacySettings: {
            profileVisibility: 'friends',
            showEmail: true,
            allowMessages: true
          }
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/New_York',
          notificationPreferences: {
            emailDigest: 'weekly',
            pushNotifications: true,
            smsAlerts: false
          },
          advancedSettings: {
            debugMode: false,
            autoSave: true,
            maxConcurrentSessions: 4
          }
        },
        readOnlyInfo: {
          accountCreated: '2024-06-01T12:00:00Z',
          lastLogin: '2026-01-26T09:15:00Z',
          accountType: 'Standard',
          subscriptionLevel: 'Basic Plan'
        }
      },
      {
        id: 5,
        name: 'Sarah Anderson',
        email: 'sarah.anderson@example.com',
        username: 'sarah.a',
        age: 31,
        role: 'user',
        status: 'inactive',
        phone: '(555)500-6001',
        website: '',
        newsletter: false,
        emailNotifications: false,
        twoFactorAuth: false,
        address: {
          street: '654 Commerce Street',
          suite: 'Unit 12',
          city: 'Boston',
          zipcode: '02101',
          country: 'usa'
        },
        contact: {
          preferredContact: {
            phone: {
              phoneNumber: '+1-555-500-6001',
              bestTimeToCall: 'evening'
            }
          },
          emergencyContacts: []
        },
        company: {
          name: 'Marketing Pro Agency',
          position: 'Marketing Manager',
          department: 'marketing',
          yearsOfExperience: 8,
          catchPhrase: 'Your brand our passion',
          bs: 'Digital marketing and brand strategy'
        },
        skills: {
          primarySkills: [
            { skill: 'SEO', level: 'expert', yearsExperience: 7, certified: true },
            { skill: 'Google Analytics', level: 'advanced', yearsExperience: 6, certified: true },
            { skill: 'Content Marketing', level: 'expert', yearsExperience: 8, certified: false }
          ],
          languages: [
            { language: 'English', proficiency: 'native' },
            { language: 'French', proficiency: 'conversational' }
          ]
        },
        security: {
          password: '********',
          privacySettings: {
            profileVisibility: 'private',
            showEmail: false,
            allowMessages: true
          }
        },
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'America/New_York',
          notificationPreferences: {
            emailDigest: 'never',
            pushNotifications: false,
            smsAlerts: false
          },
          advancedSettings: {
            debugMode: false,
            autoSave: true,
            maxConcurrentSessions: 1
          }
        },
        readOnlyInfo: {
          accountCreated: '2023-11-05T15:30:00Z',
          lastLogin: '2025-12-15T11:20:00Z',
          accountType: 'Standard',
          subscriptionLevel: 'Free Plan'
        }
      }
    ];
  }

  private saveToStorage(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  private loadFromStorage(): User[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Users
  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Simulate async loading
    setTimeout(() => {
      try {
        const users = this.loadFromStorage();
        this.users.set(users);
        this.isLoading.set(false);
      } catch (err) {
        this.error.set('Error loading users from storage');
        this.isLoading.set(false);
        console.error('Error loading users:', err);
      }
    }, 300);
  }

  getUser(id: number): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.loadFromStorage();
        const user = users.find(u => u.id === id);
        if (user) {
          observer.next(user);
          observer.complete();
        } else {
          observer.error(new Error('User not found'));
        }
      }, 200);
    });
  }

  createUser(user: User): Observable<User> {
    this.isLoading.set(true);
    this.error.set(null);

    return new Observable(observer => {
      setTimeout(() => {
        try {
          const users = this.loadFromStorage();
          const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
          const newUser = { ...user, id: newId };
          const updatedUsers = [newUser, ...users];
          this.saveToStorage(updatedUsers);
          this.users.set(updatedUsers);
          this.successMessage.set(`User ${newUser.name} created successfully`);
          this.isLoading.set(false);
          this.clearSuccessMessageAfterDelay();
          observer.next(newUser);
          observer.complete();
        } catch (err) {
          this.error.set('Error creating user');
          this.isLoading.set(false);
          observer.error(err);
        }
      }, 300);
    });
  }

  updateUser(id: number, user: User): Observable<User> {
    this.isLoading.set(true);
    this.error.set(null);

    return new Observable(observer => {
      setTimeout(() => {
        try {
          const users = this.loadFromStorage();
          const updatedUser = { ...user, id };
          const updatedUsers = users.map(u => u.id === id ? updatedUser : u);
          this.saveToStorage(updatedUsers);
          this.users.set(updatedUsers);
          this.successMessage.set(`User ${updatedUser.name} updated successfully`);
          this.isLoading.set(false);
          this.clearSuccessMessageAfterDelay();
          observer.next(updatedUser);
          observer.complete();
        } catch (err) {
          this.error.set('Error updating user');
          this.isLoading.set(false);
          observer.error(err);
        }
      }, 300);
    });
  }

  deleteUser(id: number, userName: string): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    return new Observable(observer => {
      setTimeout(() => {
        try {
          const users = this.loadFromStorage();
          const updatedUsers = users.filter(u => u.id !== id);
          this.saveToStorage(updatedUsers);
          this.users.set(updatedUsers);
          this.successMessage.set(`User ${userName} deleted successfully`);
          this.isLoading.set(false);
          this.clearSuccessMessageAfterDelay();
          observer.next();
          observer.complete();
        } catch (err) {
          this.error.set('Error deleting user');
          this.isLoading.set(false);
          observer.error(err);
        }
      }, 300);
    });
  }

  clearMessages(): void {
    this.error.set(null);
    this.successMessage.set(null);
  }

  private clearSuccessMessageAfterDelay(): void {
    setTimeout(() => this.successMessage.set(null), 3000);
  }
}
