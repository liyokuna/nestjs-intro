import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //hash()
  // plain text -> hash
  //test if the bcrypt.hash was called
  // password was passed to it and salt rounds
  // mock and spies
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should verify correctly password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const password = 'password123';
    const mockHash = 'hashed_password';
    const result = await service.verify(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash);
    expect(result).toBe(true);
  });

  it('should verify uncorrectly password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const password = 'password';
    const mockHash = 'hashed_password';
    const result = await service.verify(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash);
    expect(result).toBe(false);
  });
});
