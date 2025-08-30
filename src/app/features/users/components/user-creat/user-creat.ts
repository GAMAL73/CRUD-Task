import { Component, DestroyRef, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../services/user';
import { User_interface } from '../../../../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-creat',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-creat.html',
  styleUrl: './user-creat.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreat {
  userForm: FormGroup;
  loading: boolean = false;
  destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private userService: User,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        suite: ['', [Validators.required]],
        city: ['', [Validators.required]],
        zipcode: ['', [Validators.required]],
        geo: this.fb.group({
          lat: ['', [Validators.required]],
          lng: ['', [Validators.required]]
        })
      }),
      company: this.fb.group({
        name: ['', [Validators.required]],
        catchPhrase: ['', [Validators.required]],
        bs: ['', [Validators.required]]
      })
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.cdr.markForCheck();
      const userData = this.userForm.value;

      this.userService.createUser(userData).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      ).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.router.navigateByUrl('/users');
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }


  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
