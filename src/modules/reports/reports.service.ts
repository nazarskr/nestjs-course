import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from '@modules/reports/dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '@modules/reports/reports.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/users.entity';
import { GetEstimateDto } from '@modules/reports/dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, lng, lat, mileage, year }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder('car')
      .select('ROUND(AVG(price))', 'price')
      .where('LOWER(car.make) = LOWER(:make)', { make })
      .andWhere('LOWER(car.model) = LOWER(:model)', { model })
      .andWhere('car.lng BETWEEN :lngMin AND :lngMax')
      .andWhere('car.lat BETWEEN :latMin AND :latMax')
      .andWhere('car.year BETWEEN :yearMin AND :yearMax')
      .orderBy('ABS(car.mileage - :mileage)', 'ASC')
      .setParameters({
        lngMin: lng - 5,
        lngMax: lng + 5,
        latMin: lat - 5,
        latMax: lat + 5,
        yearMin: year - 3,
        yearMax: year + 3,
        mileage,
      })
      .getRawMany();
  }

  create(dto: CreateReportDto, user: User) {
    const report = this.repo.create(dto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({
      where: { id: parseInt(id) },
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
