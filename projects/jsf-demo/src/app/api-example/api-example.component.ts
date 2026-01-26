import {
  Component,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, User } from '../services/api.service';
import { UserModalComponent } from './user-modal/user-modal.component';

@Component({
  selector: 'app-api-example',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  templateUrl: './api-example.component.html',
  styleUrls: ['./api-example.component.scss']
})
export class ApiExampleComponent implements OnInit {
  showModal = signal<boolean>(false);
  editingUserId = signal<number | null>(null);
  userToEdit = signal<User | null>(null);

  users = this.apiService.users;
  isLoading = this.apiService.isLoading;
  error = this.apiService.error;
  successMessage = this.apiService.successMessage;

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.loadUsers();
  }

  showAddForm() {
    this.editingUserId.set(null);
    this.userToEdit.set(null);
    this.apiService.clearMessages();
    this.showModal.set(true);
  }

  editUser(user: User) {
    console.log('Editing user:', user);
    this.editingUserId.set(user.id!);
    this.apiService.clearMessages();

    this.apiService.getUser(user.id!).subscribe({
      next: (freshUser) => {
        console.log('Loaded user for editing:', freshUser);
        this.userToEdit.set(freshUser);
        this.showModal.set(true);
      },
      error: (err) => {
        this.apiService.error.set('Error loading user data');
        console.error('Error loading user:', err);
      }
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    this.apiService.deleteUser(user.id!, user.name).subscribe();
  }

  viewUserDetails(user: User) {
    this.router.navigate(['/user', user.id]);
  }

  onModalSave(user: User) {
    const editingId = this.editingUserId();
    
    if (editingId) {
      this.apiService.updateUser(editingId, user).subscribe({
        next: () => {
          this.closeModal();
        }
      });
    } else {
      this.apiService.createUser(user).subscribe({
        next: () => {
          this.closeModal();
        }
      });
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.editingUserId.set(null);
    this.userToEdit.set(null);
    this.apiService.clearMessages();
  }
}
