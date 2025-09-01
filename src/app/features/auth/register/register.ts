import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { Spinner } from "../../additions/spinner/spinner";
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Spinner,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Register {
  errMsg!: string;
  loading!: boolean;
  private auth=inject(Auth);
  private _Router=inject(Router);
  destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);


  registerForm:FormGroup=new FormGroup({
    name: new FormControl(null,[Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null,[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]),
    rePassword: new FormControl(null,[Validators.required]),
    phone: new FormControl(null,[Validators.required, Validators.pattern('^01[0125][0-9]{8}$')])
  },{ validators: this.checkPasswordMatch });

  checkPasswordMatch(g:AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    }else {
      g.get('rePassword')?.setErrors({ notMatch: true });
      return { notMatch: true };
    }
  }
  submitFormRegister() {
    this.loading=true;
    if(this.registerForm.valid){
      this.auth.signUp(this.registerForm.value).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => { this.loading = false;})
      ).subscribe({
        next: () => {
          this._Router.navigate(['/login'])
          this.loading=false;
          this.cdr.markForCheck();
        },
        error: (err)=>{
          this.errMsg=err.error.message;
          console.log(err);
          this.loading=false;
          this.cdr.markForCheck();
        }
      })
    }
  }
}
