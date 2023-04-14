import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  form = {
    username: '',
    password: '',
  };

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    if (this.accountService.isLoggedIn()) {
      // @TODO use routes instead
      window.location.replace(`${window.location.host}/home`);
    }
  }

  onSubmit() {
    console.log('onSubmit() form: ');
    console.log(this.form);

    const { username, password } = this.form;

    this.accountService
      .login(username, password)
      .then((res) => {
        console.log('onSubmit() success! res: ');
        console.log(res);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = ['user'];

        // test out the profile one
        const agent = this.accountService.getAgent();
        const profile = agent
          .getProfile()
          .then((profile) => {
            console.log('NEW! getProfile results: ');
            console.log(profile);
          })
          .catch((err) => console.warn(err));

        this.reloadPage();
      })
      .catch((err) => {
        this.isLoginFailed = true;
        this.errorMessage = err;
      });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
