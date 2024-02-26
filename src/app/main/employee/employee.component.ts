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
  sortColumns = [
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Date of birth',
      value: 'birthDate',
    },
    {
      label: 'Salary',
      value: 'basicSalary',
    },
  ];
  isLoading = false;
  isMobileTabDisplay: boolean = false;
  isShowFilter = false;

  dataEmployee: Employee[] = [];
  dataSource = new MatTableDataSource();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.sortFilteredEmployee();
    this.subs = this.employeeService.isMobileTabDisplay.subscribe((val) => {
      this.isMobileTabDisplay = val ? val : false;
      if (this.isMobileTabDisplay) {
        this.displayedColumns = [
          'name',
          'status',
          'birthDate',
          'group',
          'basicSalary',
          'action',
        ];
      }
    });
  }
  setIsShowFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  sortedBy(value: any, direction: any) {
    if (this.sort) {
      this.sort.sort({
        id: value,
        start: direction,
        disableClear: false,
      });
    }
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
    const filteredValue = this.employeeService.getSortFilterEmployee();
    this.filteredData(filteredValue?.filter);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (
      this.sort &&
      filteredValue?.sort?.active &&
      filteredValue?.sort?.direction
    ) {
      this.sort.sort({
        id: filteredValue?.sort.active,
        start: filteredValue?.sort?.direction,
        disableClear: false,
      });
    }
    if (
      filteredValue?.pagination?.pageSize &&
      filteredValue?.pagination?.pageIndex &&
      this.paginator
    ) {
      this.paginator.pageSize = filteredValue.pagination?.pageSize;
      this.paginator.pageIndex = filteredValue.pagination?.pageIndex;
    }
    this.isLoading = false;
  }
  sortFilteredEmployee() {
    this.subs = this.employeeService.sortFilterEmployee.subscribe((data) => {
      this.isLoading = true;
      this.filteredData(data?.filter);
      this.isLoading = false;
    });
  }
  filteredData(filter: any) {
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
        if (key === 'minSalary' && filter[key]) {
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
  }
  viewEmployee(id: number) {
    if (id > 0) {
      this.employeeService.setSortFilter({
        ...this.employeeService.getSortFilterEmployee(),
        sort: {
          active: this.sort.active,
          direction: this.sort.direction,
        },
        pagination: {
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
        },
      });
      this.router.navigate(['/detail', id]);
    }
  }
  goToForm(type: string, id?: number) {
    if (type === 'new') {
      this.employeeService.setSortFilter({
        sort: null,
        filter: null,
        pagination: null,
      });
    }
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
    this.employeeService.setResetFilter(true);
    this.paginator.firstPage();
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
