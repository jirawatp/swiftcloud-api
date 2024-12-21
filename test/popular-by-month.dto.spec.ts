import { validate } from 'class-validator';
import { PopularByMonthDto } from '../src/common/dto/popular-by-month.dto';
import { PopularityType } from '../src/common/enums/popularity-type.enum';

describe('PopularByMonthDto', () => {
  it('should fail for invalid year', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 1800; // Invalid year
    dto.month = 7;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail for invalid month', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 13; // Invalid month

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail for invalid type', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 7;
    dto.type = 'invalid-type' as any; // Invalid type

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isIn'); // Check for enum constraint
  });

  it('should pass for valid input', async () => {
    const dto = new PopularByMonthDto();
    dto.year = 2021;
    dto.month = 7;
    dto.type = PopularityType.SONG;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});