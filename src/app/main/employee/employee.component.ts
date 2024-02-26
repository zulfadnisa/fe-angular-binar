import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/service/employee.model';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  subs: Subscription;

  displayedColumns = [
    'username',
    'name',
    'email',
    'birthDate',
    'basicSalary',
    'status',
    'group',
    'action',
  ];
  isLoading = false;

  dataEmployee: Employee[] = [];
  dataSource = new MatTableDataSource();
  isReset = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.filteredEmployee();
    this.sortedEmployee();
  }
  getData() {
    this.isLoading = true;
    const data: Employee[] = this.employeeService.getDummyData();
    this.dataEmployee = data?.length
      ? data.map((user) => {
          return {
            ...user,
            name: user?.firstName + ' ' + user?.lastName,
          };
        })
      : [];
    this.dataSource.data = this.dataEmployee;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }
  filteredEmployee() {
    this.subs = this.employeeService.filterEmployee.subscribe((filter) => {
      this.isLoading = true;
      if (filter && typeof filter === 'object' && this.dataEmployee?.length) {
        let newData = this.dataEmployee.map((user) => {
          const today: Date = new Date();
          return {
            ...user,
            age: user.birthDate
              ? today.getFullYear() - user.birthDate.getFullYear()
              : 0,
          };
        });
        for (let key in filter) {
          if ((key === 'minSalary' || key === 'maxSalary') && filter[key]) {
            newData = newData.filter((user) => user.basicSalary >= filter[key]);
          } else if (key === 'maxSalary' && filter[key]) {
            newData = newData.filter((user) => user.basicSalary <= filter[key]);
          } else if (key === 'age' && filter[key]) {
            newData = newData.filter((user) =>
              filter[key] === 'less'
                ? user?.age < 18
                : filter[key] === 'between'
                ? user?.age >= 18 && user?.age <= 25
                : user?.age > 25
            );
          } else if (key === 'status' && filter[key]) {
            newData = newData.filter((user) => filter[key] === user.status);
          } else if (key === 'groups' && filter[key]?.length) {
            newData = newData.filter((user: any) =>
              filter[key]?.includes(user.group)
            );
          } else if (filter[key]) {
            newData = newData.filter((user: any) =>
              user[key]
                ?.toLowerCase()
                ?.trim()
                ?.includes(filter[key]?.toLowerCase()?.trim())
            );
          }
        }
        this.dataSource.data = newData;
      } else {
        this.dataSource.data = this.dataEmployee;
      }
      this.isReset = false;
      this.isLoading = false;
    });
  }
  sortedEmployee() {
    this.subs = this.employeeService.sortEmployee.subscribe((sort) => {
      if (!this.isReset) {
        this.sort.active = sort?.active ? sort.active : this.sort.active;
        this.sort.direction = sort?.direction
          ? sort.direction
          : this.sort.direction;
      }
      this.isReset = false;
    });
  }
  viewEmployee(id: number) {
    if (id > 0) {
      this.employeeService.setSortEmployee({
        active: this.sort.active,
        direction: this.sort.direction,
      });
      this.router.navigate(['/detail', id]);
    }
  }
  goToForm(type:string,id?: number) {
    this.employeeService.setSortEmployee(null);
    this.employeeService.setFilterEmployee(null);
    this.router.navigate(['/employee-form'], {
      queryParams: { type, id },
    });
  }
  deleteEmployee(id: number) {
    if (id >= 0) {
      this.employeeService.deleteEmployee(id);
      this.getData();
    }
  }
  resetTable() {
    this.isReset = true;
    this.paginator.firstPage()
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
    this.employeeService.setSortEmployee(null);
    this.getData();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
