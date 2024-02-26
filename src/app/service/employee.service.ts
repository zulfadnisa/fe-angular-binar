import { FormControl } from '@angular/forms';
import { Employee } from './employee.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  dummyData: Employee[] = [];
  filterEmployee: BehaviorSubject<any> = new BehaviorSubject(null);
  sortEmployee: BehaviorSubject<any> = new BehaviorSubject(null);

  // BehaviorSubject Section
  setFilterEmployee(value: any) {
    this.filterEmployee.next(value);
  }
  getFilterEmployee() {
    return this.filterEmployee.getValue();
  }
  setSortEmployee(value: any) {
    this.sortEmployee.next(value);
  }

  // Data Section
  getDummyData() {
    return this.dummyData.length ? this.dummyData : [];
  }
  getRandomDummyData() {
    if (!this.dummyData?.length) {
      this.dummyData = [];
      for (let i = 1; i <= 100; i++) {
        const randomNumber = i % 10 === 0 ? 10 : i % 10;
        const data: Employee = {
          id: i,
          username: `testUser${i}`,
          firstName: 'User',
          lastName: `${
            i % 26 === 0
              ? String.fromCharCode(90)
              : String.fromCharCode((i % 26) + 64)
          }`,
          email: `user${i}@mail.com`,
          birthDate: new Date(randomNumber + 2000, randomNumber, randomNumber),
          basicSalary: i * 100000,
          status: i % 2 === 0 ? 'active' : 'inactive',
          group: `Group ${randomNumber}`,
          description: new Date(2023, randomNumber, randomNumber),
        };
        this.dummyData.push(data);
      }
    }
  }
  getOneData(id: number) {
    if (id > 0 && this.dummyData.length) {
      const data = this.dummyData.find((user) => user.id === id);
      return data;
    } else {
      return;
    }
  }
  getGroups() {
    const groups = [];
    for (let i = 0; i < 10; i++) {
      groups.push(`Group ${i + 1}`);
    }
    return groups;
  }

  // Action Section
  deleteEmployee(id: number) {
    if (id > 0 && this.dummyData?.length) {
      const index = this.dummyData.findIndex((user) => user.id === id);
      if (index >= 0) {
        this.dummyData.splice(index, 1);
      }
    }
  }
  addEmployee(payload: Employee) {
    if (payload) {
      const id =
        this.dummyData.length &&
        this.dummyData[this.dummyData.length - 1]?.id >= 0
          ? Number(this.dummyData[this.dummyData.length - 1]?.id) + 1
          : 1;
      const newData: Employee = { ...payload, id, description: new Date() };
      this.dummyData.push(newData);
    }
  }
  updateEmployee(id: number, payload: Employee) {
    if (payload) {
      const index = this.dummyData.findIndex((user) => user.id === id);
      if (index >= 0) {
        const updateData: Employee = {
          ...payload,
          id: +id,
          description: this.dummyData[index].description,
        };
        this.dummyData.splice(index, 1, updateData);
      }
    }
  }

  // Custom Validator
  noWhiteSpace(control: FormControl) {
    return (control.value || '').trim()?.length === 0
      ? { whitespace: true }
      : null;
  }
}
