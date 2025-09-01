import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Spinner } from "../../additions/spinner/spinner";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Spinner,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Login {
  errMsg!: string;
  loading!: boolean;
  private auth=inject(Auth);
  private _Router=inject(Router);
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  LoginForm:FormGroup=new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl(null,[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')])
  })
  submitFormLogin() {
    if(this.LoginForm.valid){
      this.loading=true;
      this.auth.signin(this.LoginForm.value).pipe(
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
