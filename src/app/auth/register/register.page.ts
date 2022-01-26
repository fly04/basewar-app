import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsersService } from '../../services/api/users.service';
import { AuthRequest } from '../../models/auth-request';
import { UserRegister } from 'src/app/models/user-register';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authRequest: AuthRequest;
  registerError: boolean;
  user: UserRegister;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UsersService
  ) {
    this.user = {
      name: undefined,
      password: undefined,
    };
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.registerError = false;
    this.userService.postUser(this.user).subscribe(() => {
      this.authService.notify(`Inscription réussie, ${this.user.name} !`);
      this.router.navigateByUrl('/login');
    });
  }

  ngOnInit() {}
}
