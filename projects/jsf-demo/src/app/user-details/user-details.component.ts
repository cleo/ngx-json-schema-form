import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JSFConfig, JSFSchemaData } from 'jsf';
import { JSFModule } from 'jsf';
import { ApiService, User } from '../services/api.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, JSFModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId = signal<number>(0);
  user = signal<User | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  schemaData = signal<JSFSchemaData | null>(null);

  config: JSFConfig = {
    enableCollapsibleSections: true,
    showSectionDivider: true,
    expandOuterSectionsByDefault: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(parseInt(id, 10));
      this.loadUserData();
    }
  }

  loadUserData() {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.getUser(this.userId()).subscribe({
      next: (user) => {
        this.user.set(user);
        this.buildSchemaData(user);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading user data');
        this.isLoading.set(false);
        console.error('Error:', err);
      }
    });
  }

  buildSchemaData(user: User) {
    const formData = {
      userInfo: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        age: user.age,
        role: user.role,
        status: user.status
      },
      address: {
        street: user.address?.street || '',
        suite: user.address?.suite || '',
        city: user.address?.city || '',
        zipcode: user.address?.zipcode || '',
        country: user.address?.country || '',
        coordinates: {
          lat: user.address?.geo?.lat || '0',
          lng: user.address?.geo?.lng || '0'
        }
      },
      contact: {
        preferredContact: user.contact?.preferredContact || 'email',
        emailAddress: user.email,
        phoneNumber: user.phone,
        socialMedia: '',
        emergencyContacts: user.contact?.emergencyContacts || []
      },
      company: {
        name: user.company?.name || '',
        catchPhrase: user.company?.catchPhrase || '',
        bs: user.company?.bs || '',
        department: user.company?.department || '',
        position: user.company?.position || '',
        yearsOfExperience: user.company?.yearsOfExperience
      },
      skills: {
        primarySkills: user.skills?.primarySkills || [],
        languages: user.skills?.languages || [],
        certifications: ''
      }
    };

    const schema = this.createCompleteSchema();
    this.schemaData.set(new JSFSchemaData(schema, formData));
  }

  createCompleteSchema() {
    return {
      type: 'object',
      properties: {
        userInfo: {
          type: 'object',
          title: 'User Information',
          properties: {
            id: {
              type: 'number',
              title: 'User ID',
              readOnly: true
            },
            name: {
              type: 'string',
              title: 'Full Name',
              minLength: 3,
              maxLength: 100
            },
            username: {
              type: 'string',
              title: 'Username',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              title: 'Email',
              format: 'email'
            },
            phone: {
              type: 'string',
              title: 'Phone'
            },
            website: {
              type: 'string',
              title: 'Website'
            },
            age: {
              type: 'integer',
              title: 'Age',
              minimum: 18,
              maximum: 100
            },
            role: {
              type: 'string',
              title: 'Role',
              enum: ['admin', 'user', 'moderator', 'guest']
            },
            status: {
              type: 'string',
              title: 'Account Status',
              enum: ['active', 'inactive', 'suspended']
            }
          },
          required: ['name', 'username', 'email']
        },
        address: {
          type: 'object',
          title: 'Address',
          properties: {
            street: {
              type: 'string',
              title: 'Street'
            },
            suite: {
              type: 'string',
              title: 'Suite'
            },
            city: {
              type: 'string',
              title: 'City'
            },
            zipcode: {
              type: 'string',
              title: 'Zip Code'
            },
            country: {
              type: 'string',
              title: 'Country',
              enum: ['USA', 'Canada', 'Mexico', 'UK', 'Spain', 'France', 'Germany', 'Italy', 'Japan', 'China', 'Brazil', 'Argentina', 'Chile']
            },
            coordinates: {
              type: 'object',
              title: 'GPS Coordinates',
              properties: {
                lat: {
                  type: 'string',
                  title: 'Latitude'
                },
                lng: {
                  type: 'string',
                  title: 'Longitude'
                }
              }
            }
          }
        },
        contact: {
          type: 'object',
          title: 'Contact Information',
          properties: {
            preferredContact: {
              type: 'string',
              title: 'Preferred Contact Method',
              oneOf: [
                { enum: ['email'], title: 'Email' },
                { enum: ['phone'], title: 'Phone' },
                { enum: ['social'], title: 'Social Media' }
              ]
            },
            emergencyContacts: {
              type: 'array',
              title: 'Emergency Contacts',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', title: 'Name' },
                  phone: { type: 'string', title: 'Phone' },
                  relationship: { type: 'string', title: 'Relationship' }
                }
              }
            }
          },
          dependencies: {
            preferredContact: {
              oneOf: [
                {
                  properties: {
                    preferredContact: { enum: ['email'] },
                    emailAddress: { type: 'string', title: 'Email Address', format: 'email' }
                  }
                },
                {
                  properties: {
                    preferredContact: { enum: ['phone'] },
                    phoneNumber: { type: 'string', title: 'Phone Number' }
                  }
                },
                {
                  properties: {
                    preferredContact: { enum: ['social'] },
                    socialMedia: { type: 'string', title: 'Social Media Handle' }
                  }
                }
              ]
            }
          }
        },
        company: {
          type: 'object',
          title: 'Company',
          properties: {
            name: {
              type: 'string',
              title: 'Company Name'
            },
            catchPhrase: {
              type: 'string',
              title: 'Catch Phrase'
            },
            bs: {
              type: 'string',
              title: 'Business'
            },
            department: {
              type: 'string',
              title: 'Department',
              enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Support']
            },
            position: {
              type: 'string',
              title: 'Position'
            },
            yearsOfExperience: {
              type: 'integer',
              title: 'Years of Experience',
              minimum: 0,
              maximum: 50
            }
          }
        },
        skills: {
          type: 'object',
          title: 'Skills & Qualifications',
          properties: {
            primarySkills: {
              type: 'array',
              title: 'Primary Skills',
              items: {
                type: 'object',
                properties: {
                  skill: { type: 'string', title: 'Skill' },
                  level: { 
                    type: 'string', 
                    title: 'Level',
                    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
                  },
                  years: { type: 'integer', title: 'Years' },
                  certified: { type: 'boolean', title: 'Certified' }
                }
              }
            },
            languages: {
              type: 'array',
              title: 'Languages',
              items: {
                type: 'object',
                properties: {
                  language: { type: 'string', title: 'Language' },
                  proficiency: {
                    type: 'string',
                    title: 'Proficiency',
                    enum: ['Basic', 'Intermediate', 'Advanced', 'Native']
                  }
                }
              }
            },
            certifications: {
              type: 'string',
              title: 'Certifications',
              widget: 'textarea'
            }
          }
        }
      }
    };
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
