import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should throw an exception for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      jest.spyOn(usersService, 'findByEmail');

      await expect(
        authService.validateUser({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(HttpException);

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
