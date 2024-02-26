import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { EmployeeService } from '../service/employee.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  subs: Subscription;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.employeeService.getRandomDummyData();
    this.checkDisplay();
  }
  checkDisplay() {
    this.subs = this.breakpointObserver
      .observe('(max-width: 920px)')
      .subscribe((result) => {
        this.employeeService.setIsMobileTabDisplay(result.matches);
      });
  }
  logout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
