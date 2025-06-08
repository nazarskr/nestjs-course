import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post, Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from '@modules/reports/dtos/create-report.dto';
import { ReportsService } from '@modules/reports/reports.service';
import { AuthGuard } from '@core/guards/auth.guard';
import { CurrentUser } from '@modules/users/decorators/current-user.decorator';
import { User } from '@modules/users/users.entity';
import { Serialize } from '@core/interceptors/serialize.interceptor';
import { ReportDto } from '@modules/reports/dtos/report-dto';
import { ApproveReportDto } from '@modules/reports/dtos/approve-report.dto';
import { AdminGuard } from '@core/guards/admin.guard';
import { GetEstimateDto } from '@modules/reports/dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }
}
