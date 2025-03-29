export type User = {
  id: string
  email: string
  username: string
  verified: boolean
}

export type LoginResponse = {
  success: boolean
  message: string
  user?: User
  requiresVerification?: boolean
}

export type RegisterResponse = {
  success: boolean
  message: string
  requiresVerification: boolean
}

export type VerificationResponse = {
  success: boolean
  message: string
  user?: User
}
