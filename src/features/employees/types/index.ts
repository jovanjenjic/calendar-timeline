export interface Employee {
  _id: string;
  deletedAt: null | string;
  isDeleted: boolean;
  dateOfBirth: string;
  dateOfEmployment: string;
  homeAddress: {
    addressLine1: string;
    addressLine2: string;
    ZIPCode: string;
    city: string;
    _id: string;
  };
  phoneNumber: string;
  email: string;
  name: string;
  __v: number;
}

export interface EmployeesResponse {
  employees: Employee[];
  count: number;
}

export interface EmployeeQueryArgsData {
  page?: number;
  limit?: number;
  searchText?: string;
}

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

export interface TableColumns {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfEmployment: string;
  city: string;
}

export interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}
