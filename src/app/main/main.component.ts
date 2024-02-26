import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private authService: AuthService,private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getRandomDummyData();
  }
  logout() {
    this.authService.logout();
  }
}
