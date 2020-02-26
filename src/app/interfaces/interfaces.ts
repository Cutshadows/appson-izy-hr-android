export interface Module{
	resultEvents:Events[]
}
interface Events {
	Id: number;
	Name: string;
  }

export interface RegisterEvents {
	EmployeeId: number;
	EventConfigId: number;
	From: string;
	To: string;
	Description: string;
}
