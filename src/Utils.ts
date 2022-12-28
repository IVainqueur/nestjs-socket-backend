import { JwtService } from '@nestjs/jwt';

export default class Utils {
  constructor(private jwtService: JwtService) {}

  static generateUID(): string {
    const firstPart: number = (Math.random() * 46656) | 0;
    const secondPart: number = (Math.random() * 46656) | 0;

    return (
      ('000' + firstPart.toString(36)).slice(-3) +
      ('000' + secondPart.toString(36)).slice(-3)
    );
  }

  static decodeJWT(token: string): any {
    // use the jwt verify method to decode the token
    return new JwtService({ secret: process.env.JWT_SECRET }).verify(token);
  }
}
