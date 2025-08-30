import { Component, DestroyRef, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../services/user';
import { User_interface } from '../../../../models/user.model';
import { Spinner } from "../../../additions/spinner/spinner";
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, Spinner],
  templateUrl: './user-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetail implements OnInit {
  user: User_interface | null = null;
  loading:boolean = true;
  private destroyRef=inject(DestroyRef);
  private userService=inject(User);
  private cdr = inject(ChangeDetectorRef);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserDetails(userId);
    }
  }

  loadUserDetails(userId: string) {
    this.userService.getUserById(userId).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (user) => {
        this.user = user;
        this.cdr.markForCheck();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  editUser() {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }
}
