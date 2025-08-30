import { CommonModule } from '@angular/common';
import { Component, OnInit, DestroyRef, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../services/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, finalize, switchMap } from 'rxjs';
import { Spinner } from "../../../additions/spinner/spinner";

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class UserEdit implements OnInit {
  userForm!: FormGroup;
  loading: boolean = false;
  userId: number | null = null;
  destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private userService: User,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(params => {
        this.userId = Number(params.get('id'));
        if (this.userId) {
          this.loading = true;

          return this.userService.getUserById(this.userId.toString())
            .pipe(finalize(() => this.loading = false));
        }
        return EMPTY;
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue(user);
                  this.cdr.markForCheck();

        }
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
        geo: this.fb.group({
          lat: [''],
          lng: ['']
        })
      }),
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: ['']
      })
    });
  }

  loadUser(): void {
    if (!this.userId) return;
    this.loading = true;
    this.userService.getUserById(this.userId.toString()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData = this.userForm.value;

      if (this.userId) {
        // Update existing user
        this.userService.updateUser(this.userId, userData).pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        ).subscribe({
          next: () => {
            console.log(`User ${this.userId} updated`);
                    this.cdr.markForCheck();

            this.router.navigate(['/users']);
          },
          error: (err) => {
            console.error('Error updating user:', err);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
