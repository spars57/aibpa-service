import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import CreateUserSettingsRequest from 'src/types/request/user-settings/create'
import CreateUserSettingsResponse from 'src/types/response/user-settings/create'
import { AuthenticationErrorMessages } from '../authentication/messages'
import { UserSettingsMessages } from './messages'

export const SwaggerGetUserSettingsResponse = () => {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'The authorization token',
    }),
    ApiParam({
      name: 'uuid',
      type: String,
      description: 'The UUID of the user',
    }),
    ApiBadRequestResponse({
      description: UserSettingsMessages.BadRequest,
    }),
    ApiOkResponse({
      description: UserSettingsMessages.UserSettingsRetrievedSuccessfully,
      type: CreateUserSettingsResponse,
      isArray: true,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
  )
}

export const SwaggerCreateUserSettingsResponse = () => {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'The authorization token',
    }),
    ApiBadRequestResponse({
      description: UserSettingsMessages.BadRequest,
    }),
    ApiOkResponse({
      type: CreateUserSettingsResponse,
    }),
    ApiBody({
      type: CreateUserSettingsRequest,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
  )
}

export const SwaggerDeleteUserSettingsResponse = () => {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'The authorization token',
    }),
    ApiBadRequestResponse({
      description: UserSettingsMessages.BadRequest,
    }),
    ApiNoContentResponse({
      description: UserSettingsMessages.UserSettingsDeletedSuccessfully,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
    ApiParam({
      name: 'uuid',
      type: String,
      description: 'The UUID of the user',
    }),
    ApiParam({
      name: 'key',
      type: String,
      description: 'The key of the user setting',
    }),
  )
}
