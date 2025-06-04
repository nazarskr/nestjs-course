import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '@modules/reports/dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '@modules/reports/reports.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(dto: CreateReportDto, user: User) {
    const report = this.repo.create(dto);
    report.user = user;
    return this.repo.save(report);
  }
}
