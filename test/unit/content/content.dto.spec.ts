import 'reflect-metadata';
import { ValidationError, validateOrReject } from 'class-validator';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';
import { ContentType } from '@common/enums/content-type.enum';
import {
  mockCreateContentDto,
  mockUpdateContentDto,
} from '../../mocks/content.mocks';

describe('CreateContentDto', () => {
  it('should be valid with correct values', async () => {
    const dto = new CreateContentDto();
    dto.name = mockCreateContentDto.name;
    dto.description = mockCreateContentDto.description;
    dto.type = mockCreateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toEqual(0);
  });

  it('should require name field', async () => {
    const dto = new CreateContentDto();
    dto.description = mockCreateContentDto.description;
    dto.type = mockCreateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBe('name should not be empty');
  });

  it('should require description field', async () => {
    const dto = new CreateContentDto();
    dto.name = mockCreateContentDto.name;
    dto.type = mockCreateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBe(
      'description should not be empty',
    );
  });

  it('should require type field to be valid enum', async () => {
    const dto = new CreateContentDto();
    dto.name = mockCreateContentDto.name;
    dto.description = mockCreateContentDto.description;
    dto.type = 'InvalidType' as ContentType;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBe(
      'type must be one of the following values: video, pdf, image',
    );
  });

  it('should allow valid enum values for type field', async () => {
    const dto = new CreateContentDto();
    dto.name = mockCreateContentDto.name;
    dto.description = mockCreateContentDto.description;
    dto.type = mockCreateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toEqual(0);
  });
});

describe('UpdateContentDto', () => {
  it('should be valid with correct values', async () => {
    const dto = new UpdateContentDto();
    dto.name = mockUpdateContentDto.name;
    dto.description = mockUpdateContentDto.description;
    dto.type = mockUpdateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toEqual(0);
  });

  it('should allow empty values for optional fields', async () => {
    const dto = new UpdateContentDto();

    const errors = await validate(dto);

    expect(errors.length).toEqual(0);
  });

  it('should require type field to be valid enum', async () => {
    const dto = new UpdateContentDto();
    dto.name = mockUpdateContentDto.name;
    dto.description = mockUpdateContentDto.description;
    dto.type = 'InvalidType' as ContentType;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBe(
      'type must be one of the following values: video, pdf, image',
    );
  });

  it('should allow valid enum values for type field', async () => {
    const dto = new UpdateContentDto();
    dto.name = mockUpdateContentDto.name;
    dto.description = mockUpdateContentDto.description;
    dto.type = mockUpdateContentDto.type;

    const errors = await validate(dto);

    expect(errors.length).toEqual(0);
  });
});

// Função auxiliar para validação utilizando class-validator
async function validate(dto: any): Promise<ValidationError[]> {
  try {
    await validateOrReject(dto, {
      forbidUnknownValues: true,
    });
    return [];
  } catch (errors) {
    return errors as ValidationError[];
  }
}
