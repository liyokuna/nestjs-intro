import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.fr';
    dto.name = 'Peter Botha';
    dto.password = '123456A!';
  });

  it('should validate complete valid data', async () => {
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    dto.email = 'email';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  const testPassword = async (password: string, message: string) => {
    dto.password = password;

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(errors).not.toBeUndefined();

    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages[0]).toContain(message);
  };

  // At least A uppercase letter
  // At least 1 number
  // At least 1 specal character
  it('should return specific validation messages', async () => {
    testPassword('abcdeF', 'Password must contain at least 1 uppercase letter');
  });

  it('should fail without at least 1 number', async () => {
    testPassword('abcdeF1', 'Password must contain at least 1 number');
  });

  it('should fail without at least 1 special character', async () => {
    testPassword(
      'abcdef1A!',
      'Password must contain at least 1 special character',
    );
  });
});
