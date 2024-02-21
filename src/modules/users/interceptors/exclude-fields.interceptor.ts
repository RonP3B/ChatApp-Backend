import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@prisma/client';
import { SafeUser } from 'src/shared/types';
import { excludedUserFields } from 'src/shared/utils';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return null;

        if (Array.isArray(data)) {
          return data.map((item) => this.excludeFields(item));
        }

        return this.excludeFields(data);
      }),
    );
  }

  private excludeFields(user: User): SafeUser {
    return Object.fromEntries(
      Object.entries(user).filter(
        ([currentKey]) => !excludedUserFields.includes(currentKey),
      ),
    ) as SafeUser;
  }
}
