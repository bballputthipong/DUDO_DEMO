export interface CorporateDashboard {
  period: string;
  totalEmployees: number;
  activeEmployees: number;
  tokenUtilizationRate: number;
  totalTokensAllocated: number;
  totalTokensUsed: number;
  topCategories: Array<{
    category: string;
    bookingCount: number;
    percentageOfTotal: number;
  }>;
  departmentBreakdown: Array<{
    departmentId: string;
    departmentName: string;
    activeRate: number;
    topCategory: string;
  }>;
  popularTimeSlots: Array<{
    hour: number;
    bookingCount: number;
  }>;
}

export interface DepartmentInsights {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  activeRate: number;
  topCategories: Array<{
    category: string;
    bookingCount: number;
  }>;
}
