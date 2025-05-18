import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  Type
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export function Serialize<DTO>(dto: Type<DTO>) {
  return UseInterceptors(SerializeInterceptor(dto));
}

export function SerializeInterceptor<DTO>(dto: Type<DTO>): NestInterceptor {
  return {
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> {
      return next.handle().pipe(
        map((data: any) => {
          return plainToInstance(dto, data, {
            excludeExtraneousValues: true,
          });
        }),
      );
    },
  };
}
