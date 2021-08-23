import { internet } from 'faker';
import { User } from './user.entity';

describe('User class', () => {
  it('should make a user with no fields', () => {
    const user = new User();

    expect(user).toBeTruthy();
    expect(user.email).toBe('');
  });

  it('should make a user with an e-mail', () => {
    const email = internet.email();
    const user = new User(email);

    expect(user).toBeTruthy();
    expect(user.email).toBe(email);
  });
});
