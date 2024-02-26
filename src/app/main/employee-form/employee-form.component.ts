import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private subs: Subscription | undefined;
  isEdit: boolean = false;
  idEmployee: number;
  maxDate: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  groups: any[] = [];

  form: FormGroup;
  prevForm: any;
  filteredGroup: any[] = [];
  currentGroup: any = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.groups = this.employeeService.getGroups();
    this.filteredGroup = this.groups;
    this.updateDropdownGroup();
    this.route.queryParams.subscribe((param: any) => {
      this.isEdit = param?.type === 'edit' ? true : false;
      this.idEmployee = param?.id;
      if (this.idEmployee && this.isEdit) {
        this.getOneData();
      }
    });
  }
  initForm() {
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.maxLength(15),Validators.pattern('^[a-zA-Z0-9_]*')]],
      firstName: [null, [Validators.required,this.employeeService.noWhiteSpace]],
      lastName: [null, [Validators.required,this.employeeService.noWhiteSpace]],
      email: [null, [Validators.required, Validators.email]],
      birthDate: [null, [Validators.required]],
      basicSalary: [null, [Validators.required, Validators.min(100000),Validators.max(100000000)]],
      status: [null, [Validators.required]],
      group: ['', [Validators.required]],
      // description: [null, [Validators.required]],
    });
  }

  getOneData() {
    this.isLoading = true;
    const data: any = this.employeeService.getOneData(+this.idEmployee);
    this.form.patchValue(data);
    this.prevForm = this.form.value;
    this.isLoading = false;
  }
  updateDropdownGroup() {
    this.subs = this.form
      .get('group')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((search) => {
        if (search?.trim()) {
          this.filteredGroup = this.groups.filter((group) =>
            group
              ?.toLowerCase()
              ?.trim()
              ?.includes(search?.toLowerCase()?.trim())
          );
        } else {
          this.filteredGroup = this.groups;
        }
      });
  }
  selectedGroup(option: any) {
    this.form.get('group')?.patchValue(option, { emitEvent: false });
    this.currentGroup = option;
  }
  checkGroupValue() {
    const current = this.form.get('group')?.value;
    if (current !== this.currentGroup) {
      const tempGroup =
        current?.toLowerCase()?.trim()
          ? this.groups.find(
              (group) =>
                group?.toLowerCase()?.trim() === current?.toLowerCase()?.trim()
            )
          : null;
      this.currentGroup = tempGroup;
      this.form.get('group')?.patchValue(tempGroup, { emitEvent: false });
    }
    this.filteredGroup = this.groups
  }
  comparison() {
    const firstForm = JSON.stringify(this.prevForm);
    const form = JSON.stringify(this.form.value);
    if (firstForm === form) {
      return true;
    } else {
      return false;
    }
  }
  saveForm() {
    if (this.form.valid) {
      const payload = this.form.value;
      if (this.isEdit && this.idEmployee) {
        this.employeeService.updateEmployee(+this.idEmployee, payload);
      } else {
        this.employeeService.addEmployee(payload);
      }
      this.backToEmployee();
    }
  }
  backToEmployee() {
    this.router.navigate(['/']);
  }
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
