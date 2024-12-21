import { PopularByMonthDto } from '../src/popular/dto/popular-by-month.dto';
import { validate } from 'class-validator';

describe('PopularByMonthDto', () => {
  it('should validate valid data', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 7;
    dto.type = 'song';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid year', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 1800; // Below minimum
    dto.month = 7;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail for invalid month', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 13; // Above maximum

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail for invalid type', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 7;
    (dto.type as any) = 'invalid'; // Invalid type

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should pass without type', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 7;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});