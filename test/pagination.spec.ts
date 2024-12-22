import { PaginationDto } from '../src/common/dto/pagination.dto';
import { validate } from 'class-validator';

describe('PaginationDto', () => {
  it('should validate correct pagination parameters', async () => {
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.offset = 0;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid pagination parameters', async () => {
    const dto = new PaginationDto();
    dto.limit = -1;
    dto.offset = -1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});