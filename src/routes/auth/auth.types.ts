export class DefaultResponse {
  success: boolean;
  message?: string;
}

export class LoginResponse extends DefaultResponse {
  access_token: string;
  fullName?: string;
  username?: string;
  profilePicture?: string;
}
