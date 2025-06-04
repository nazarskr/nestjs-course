import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from '@modules/reports/dtos/create-report.dto';
import { ReportsService } from '@modules/reports/reports.service';
import { AuthGuard } from '@core/guards/auth.guard';
import { CurrentUser } from '@modules/users/decorators/current-user.decorator';
import { User } from '@modules/users/users.entity';
import { Serialize } from '@core/interceptors/serialize.interceptor';
import { ReportDto } from '@modules/reports/dtos/report-dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
