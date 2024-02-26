import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee.service';
import { Subscription, debounceTime, pipe } from 'rxjs';

@Component({
  selector: 'app-employee-filter',
  templateUrl: './employee-filter.component.html',
  styleUrls: ['./employee-filter.component.scss'],
})
export class EmployeeFilterComponent implements OnInit, OnDestroy {
  groups: any[] = [];
  filterForms: FormGroup;
  subs: Subscription | undefined;
  @Input() isMobileTabDisplay = false

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.groups = this.employeeService.getGroups();
    this.initForm();
    this.initFilter();
    this.resetFilter();
  }
  initForm() {
    this.filterForms = this.fb.group({
      name: [null],
      age: [''],
      minSalary: [null],
      maxSalary: [null],
      status: [''],
      groups: [['all']],
    });
    if (this.employeeService.getSortFilterEmployee()?.filter) {
      this.filterForms.patchValue(this.employeeService.getSortFilterEmployee()?.filter);
    }
  }
  initFilter() {
    this.subs = this.filterForms
      .get('name')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.updateFilter({ name: value });
      });
    this.subs = this.filterForms
      .get('minSalary')
      ?.valueChanges.pipe(debounceTime(700))
      .subscribe((value) => {
        this.updateFilter({ minSalary: value });
      });
    this.subs = this.filterForms
      .get('maxSalary')
      ?.valueChanges.pipe(debounceTime(700))
      .subscribe((value) => {
        this.updateFilter({ maxSalary: value });
      });
    this.subs = this.filterForms.get('age')?.valueChanges.subscribe((value) => {
      this.updateFilter({ age: value });
    });
    this.subs = this.filterForms
      .get('status')
      ?.valueChanges.subscribe((value) => {
        this.updateFilter({ status: value });
      });
  }
  updateFilter(field: any) {
    const sortFilter = this.employeeService.getSortFilterEmployee();
    const filterValue = { ...sortFilter?.filter, ...field };

    for (let key in filterValue) {
      if (
        !filterValue[key] ||
        (Array.isArray(filterValue[key]) &&
          (!filterValue[key]?.length ||
            (filterValue[key]?.length === 1 &&
              filterValue[key].includes('all'))))
      ) {
        delete filterValue[key];
      }
    }
    const newSortFilter = {
      ...this.employeeService.getSortFilterEmployee(),
      filter: filterValue,
    };
    this.employeeService.setSortFilter(newSortFilter);
  }
  resetFilter() {
    this.subs = this.employeeService.isResetFilter.subscribe((val) => {
      if (val) {
        const resetField = {
          name: null,
          age: '',
          minSalary: null,
          maxSalary: null,
          status: '',
          groups: ['all'],
        };
        this.filterForms.patchValue(resetField, { emitEvent: false });
        this.employeeService.setSortFilter({
          sort: null,
          filter: null,
          pagination: null,
        });
        this.employeeService.setResetFilter(false);
      }
    });
  }
  updateDropdown(value: string) {
    const selectedGroup = this.filterForms.get('groups')?.value;

    if (value === 'all') {
      this.filterForms?.get('groups')?.patchValue(['all']);
    } else {
      const currGroups = selectedGroup?.length
        ? selectedGroup.filter((group: string) => group !== 'all')
        : ['all'];
      this.filterForms?.get('groups')?.patchValue(currGroups);
    }
  }
  selectedGroup(event: any) {
    if (!event) {
      this.updateFilter({ groups: this.filterForms?.get('groups')?.value });
    }
  }
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
