import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { Spinner } from "../../additions/spinner/spinner";

@Component({
  selector: 'app-reset-code',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './reset-code.html',
  styleUrl: './reset-code.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ResetCode {
  errMsg!: string;
  loading!: boolean;
  private auth=inject(Auth);
  private _Router=inject(Router);
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  codeForm:FormGroup=new FormGroup({
    resetCode:new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]{4,}$/)]),
  })
  submitForm() {
    if(this.codeForm.valid){
      this.loading=true;
      this.auth.resetCode(this.codeForm.value).pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => { this.loading = false;})
      ).subscribe({
        next:(res)=>{
          this._Router.navigate(['/newPass']);
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
