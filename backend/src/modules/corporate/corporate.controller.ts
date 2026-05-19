import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  AllocateTokensSchema,
  CreateCompanySchema,
  CreateDepartmentSchema,
  InviteEmployeeSchema,
  PeriodSchema,
  VerifyEmployeeSchema,
} from './corporate.schemas';
import { CorporateService } from './corporate.service';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Post('companies')
  createCompany(@Body() body: unknown): ReturnType<CorporateService['createCompany']> {
    return this.corporateService.createCompany(CreateCompanySchema.parse(body));
  }

  @Post('companies/:companyId/departments')
  createDepartment(
    @Param('companyId') companyId: string,
    @Body() body: unknown,
  ): ReturnType<CorporateService['createDepartment']> {
    const input = CreateDepartmentSchema.parse(body);
    return this.corporateService.createDepartment(companyId, input.name);
  }

  @Post('companies/:companyId/employees')
  inviteEmployee(
    @Param('companyId') companyId: string,
    @Body() body: unknown,
  ): ReturnType<CorporateService['inviteEmployee']> {
    const input = InviteEmployeeSchema.parse(body);
    return this.corporateService.inviteEmployee(companyId, input.email, input.departmentId);
  }

  @Post('employees/verify')
  verifyEmployeeEmail(
    @Body() body: unknown,
  ): ReturnType<CorporateService['verifyEmployeeEmail']> {
    const input = VerifyEmployeeSchema.parse(body);
    return this.corporateService.verifyEmployeeEmail(input.token);
  }

  @Post('companies/:companyId/tokens/allocate')
  allocateTokens(
    @Param('companyId') companyId: string,
    @Body() body: unknown,
  ): ReturnType<CorporateService['allocateTokens']> {
    const input = AllocateTokensSchema.parse(body);
    return this.corporateService.allocateTokens(companyId, input.month, input.perEmployee);
  }

  @Get('companies/:companyId/dashboard')
  getDashboard(
    @Param('companyId') companyId: string,
    @Query() query: unknown,
  ): ReturnType<CorporateService['getDashboard']> {
    return this.corporateService.getDashboard(companyId, PeriodSchema.parse(query));
  }

  @Get('companies/:companyId/departments/:departmentId/insights')
  getDepartmentInsights(
    @Param('companyId') companyId: string,
    @Param('departmentId') departmentId: string,
    @Query() query: unknown,
  ): ReturnType<CorporateService['getDepartmentInsights']> {
    return this.corporateService.getDepartmentInsights(
      companyId,
      departmentId,
      PeriodSchema.parse(query),
    );
  }
}
