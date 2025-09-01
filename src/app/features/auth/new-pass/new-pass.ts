import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Spinner } from "../../additions/spinner/spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-pass',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './new-pass.html',
  styleUrl: './new-pass.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NewPass {
  errMsg!: string;
  loading!: boolean;
  private auth=inject(Auth);
  private _Router=inject(Router);
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  resetNewPasswordForm:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    newPassword:new FormControl(null,[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')])
  })
  submitForm() {
    if(this.resetNewPasswordForm.valid){
      this.loading=true;
      this.auth.resetNewPassword(this.resetNewPasswordForm.value).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => { this.loading = false;})
      ).subscribe({
        next:(res)=>{
          localStorage.setItem('userToken',res.token);
          this.auth.decodeUserData();
          this._Router.navigate(['/users']);
          console.log(res);
        }
        ,error:(err)=>{
          this.errMsg=err.error.message;
          this.cdr.markForCheck();
          console.log(err);
        }
      })
    }
  }
}
