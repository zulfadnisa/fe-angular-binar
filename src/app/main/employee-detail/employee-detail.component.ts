import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/service/employee.model';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  idEmployee: number;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.idEmployee = param && param['id'] ? param['id'] : null;
      this.data = this.idEmployee
        ? this.employeeService.getOneData(+this.idEmployee)
        : null;
    });
  }
}
