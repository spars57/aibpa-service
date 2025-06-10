import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import LoginResponse from 'src/types/response/auth/login'
import RegisterResponse from 'src/types/response/auth/register'
import { AuthenticationErrorMessages, AuthenticationSuccessMessages } from './messages'

export function SwaggerLoginResponse() {
  return applyDecorators(
    ApiOkResponse({
      description: AuthenticationSuccessMessages.LoginSuccess,
      type: LoginResponse,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.InvalidCredentials,
    }),
    ApiInternalServerErrorResponse({
      description: AuthenticationErrorMessages.SomethingWentWrong,
    }),
    ApiBadRequestResponse({
      description: AuthenticationErrorMessages.LoginBadRequest,
    }),
  )
}

export function SwaggerRegisterResponse() {
  return applyDecorators(
    ApiCreatedResponse({
      description: AuthenticationSuccessMessages.RegisterSuccess,
      type: RegisterResponse,
    }),
    ApiBadRequestResponse({
      description: AuthenticationErrorMessages.RegisterBadRequest,
    }),
    ApiConflictResponse({
      description: AuthenticationErrorMessages.UserAlreadyRegistered,
    }),
  )
}

export function SwaggerLogoutResponse() {
  return applyDecorators(
    ApiNoContentResponse({
      description: AuthenticationSuccessMessages.LogoutSuccess,
    }),
    ApiHeader({
      name: 'Authorization',
      description: 'The authorization header',
      required: true,
    }),
  )
}
