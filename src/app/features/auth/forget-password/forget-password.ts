import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { Spinner } from "../../additions/spinner/spinner";

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ForgetPassword {
    errMsg!: string;
  loading!: boolean;
  private auth=inject(Auth);
  private _Router=inject(Router);
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  emailForm:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
  })
  submitForm() {
    if(this.emailForm.valid){
      this.loading=true;
      this.auth.forgetPassword(this.emailForm.value).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => { this.loading = false;})
      ).subscribe({
        next:(res)=>{
          this._Router.navigate(['/resetCode']);
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
