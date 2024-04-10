export interface IOrder extends IBaseCBDoc {
  createdBy: string;
  createdOn: string;
  description: string;
  documentType: string;
  dueDate: string;
  isComplete: boolean;
  modifiedBy: string;
  modifiedOn: string;
  name: string;
  projectId: string;
  team: string;
  warehouse: IWarehouse;
}

export interface IWarehouse {
  address1: string;
  address2: string;
  city: string;
  documentType: string;
  latitude: number;
  longitude: number;
  name: string;
  postalCode: string;
  salesTax: number;
  state: string;
  warehouseId: string;
  yearToDateBalance: number;
}

export interface IBaseCBDoc {
  _id: string;
  _rev: string;
}
