import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AadhaarComponent } from './aadhaar/aadhaar';
export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },

    { path: 'register', component: RegisterComponent },
    {path: 'aadhaar', component: AadhaarComponent}  
];
