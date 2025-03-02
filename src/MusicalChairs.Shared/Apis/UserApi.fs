module MusicalChairs.Shared.Apis.UserApi

open System
open Fable.Core

type PlannedJobId = Guid
type JobId = Guid
type UserId = Guid

// me
type UserDto =
    { id: UserId
      username: string
      email: string }

// login
type LoginRequest = { email: string; password: string }

// register
type RegisterRequest = { email: string; password: string }

type RegisterFailure =
    | EmailAlreadyRegistered
    | PasswordInvalid of reason: string

type RegisterResult = Result<unit, RegisterFailure>

// request reset password token
type RequestResetPasswordTokenRequest = { email: string }

// reset password with token
type ResetPasswordRequest =
    { email: string
      newPassword: string
      token: string }

type ResetPasswordError =
    | InvalidToken
    | InvalidNewPassword of error: string

// api
type IUserApi =
    { me: unit -> Async<Result<UserDto, string>>
      login: LoginRequest -> Async<Result<unit, string>>
      logout: unit -> Async<unit>
      register: RegisterRequest -> Async<RegisterResult>
      requestResetPasswordToken: RequestResetPasswordTokenRequest -> Async<unit>
      resetPassword: ResetPasswordRequest -> Async<Result<unit, ResetPasswordError>> }
