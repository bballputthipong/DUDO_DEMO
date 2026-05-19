import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequestSanitizationPipe implements PipeTransform<unknown> {
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    return value;
  }
}
