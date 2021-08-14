export interface CreateBreakDetailsInput {
  meeting: {
    id: {
      value: string;
    };
  };
  participants?: [
    {
      name: string;
      role: string;
    }
  ];
  start: Date;
  duration: {
    minutes: number;
    seconds: number;
  };
  cancelled: boolean;
  createdBy: {
    name: string;
    role: string;
  };
}
