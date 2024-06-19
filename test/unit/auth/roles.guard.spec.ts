import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '@common/auth/guards/roles.guard';
import { UserRole } from '@common/auth/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should return true for a handler without @Roles decorator', () => {
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn().mockReturnValue([]),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it('should return true if user role is included in roles', () => {
    const user = { role: UserRole.ADMIN };
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn().mockReturnValue([]),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it('should return false if user role is not included in roles', () => {
    const user = { role: UserRole.STUDENT };
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn().mockReturnValue([]),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(contextMock)).toBe(false);
  });

  it('should return false if no user is present', () => {
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn().mockReturnValue([]),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(contextMock)).toBe(false);
  });
});
