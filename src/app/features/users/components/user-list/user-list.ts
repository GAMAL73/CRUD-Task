import { CommonModule } from '@angular/common';
import { Component, OnInit, DestroyRef, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/user';
import { User_interface } from '../../../../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, finalize } from 'rxjs';
import { NotFond } from "../../../additions/not-fond/not-fond";
import { Spinner } from "../../../additions/spinner/spinner";

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, NotFond, Spinner],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserList implements OnInit {
  private usersSubject = new BehaviorSubject<User_interface[]>([]);
  users$ = this.usersSubject.asObservable();
  destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  loading: boolean = true;

  constructor(private userService: User, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.usersSubject.next(data);
        this.cdr.markForCheck();
        console.log('Users loaded:', data);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  deleteUser(user: User_interface): void {
    this.userService.deleteUser(user.id!).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.filter(u => u.id !== user.id);
        this.usersSubject.next(updatedUsers);
        console.log(`User ${user.id} deleted`);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

  confirmDelete(user: User_interface): void {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      this.deleteUser(user);
    }
  }

  editUser(user: User_interface): void {
    this.router.navigate(['/users', 'edit', user.id]);
  }

  viewUserDetails(user: User_interface): void {
    this.router.navigate(['/users', user.id]);
  }

  addUser(): void {
    this.router.navigate(['/create']);
  }
}
