export enum AuthenticationErrorMessages {
  UserNotFound = 'User not found.',
  InvalidCredentials = 'Invalid credentials.',
  SomethingWentWrong = 'Something went wrong.',
  LoginBadRequest = 'Email and password are required.',
  RegisterBadRequest = 'Email, password, username, first name, last name, city, and country are required.',
  UserAlreadyRegistered = 'User already registered.',
  Unauthorized = 'Unauthorized.',
}

export enum AuthenticationSuccessMessages {
  LoginSuccess = 'Login successful',
  RegisterSuccess = 'Register successful',
  LogoutSuccess = 'Logout successful',
}
