export interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: Number;
  status: string;
  group: string;
  description: Date;
  id:number;
  name?: String;
  index?:number;
  age?:number;
}
export interface sortFilter {
  sort:any;
  filter:any;
  pagination:any
}
