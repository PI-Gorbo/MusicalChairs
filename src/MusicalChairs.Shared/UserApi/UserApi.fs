namespace MusicalChairs.Shared.UserApi

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

type MeResponse = Result<UserDto, unit>
type Me = unit -> Async<MeResponse>

// login
type LoginRequest = { email: string; password: string }
type LoginResult = Result<unit, string>
type Login = LoginRequest -> Async<LoginResult>

// register
type RegisterRequest = { email: string; password: string }

[<TypeScriptTaggedUnion("type")>]
type RegisterFailure =
    | EmailAlreadyRegistered
    | PasswordInvalid of reason: string

type RegisterResult = Result<unit, RegisterFailure>
type Register = RegisterRequest -> Async<RegisterResult>

// request reset password token
type RequestResetPasswordTokenRequest = { email: string }
type RequestResetPasswordToken = RequestResetPasswordTokenRequest -> Async<unit>

// reset password with token
type ResetPasswordRequest =
    { email: string
      newPassword: string
      token: string }

[<TypeScriptTaggedUnion("type")>]
type ResetPasswordError =
    | InvalidToken
    | InvalidNewPassword of error: string

type ResetPasswordResponse = Result<unit, ResetPasswordError>
type ResetPassword = ResetPasswordRequest -> Async<ResetPasswordResponse>

// api
type IUserApi =
    { me: Me
      login: Login
      register: Register
      requestResetPasswordToken: RequestResetPasswordToken
      resetPassword: ResetPassword }
