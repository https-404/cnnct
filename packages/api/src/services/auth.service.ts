import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma'; 
import { RegisterDTO } from '../DTOs/register.dto';
import { serializeUserResponse } from '../util/userResponse.util';


class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const serializedUser = serializeUserResponse(user);
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken, user: serializedUser };
  }

  async register(registerData: RegisterDTO) {
    const { username, email, password } = registerData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const serializedUser = serializeUserResponse(newUser);

    const accessToken =  this.generateAccessToken(newUser.id);
    const refreshToken = await this.generateRefreshToken(newUser.id);

    return { accessToken, refreshToken, user: serializedUser };
  }

   generateAccessToken(userId: string) {
    const accessToken =  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    return accessToken;
  }

   async generateRefreshToken(userId: string) {
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '90d' });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
      },
    });
    return refreshToken;
  }

  async refreshTokens(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = this.generateAccessToken(String(decoded.userId));
    const newRefreshToken = await this.generateRefreshToken(String(decoded.userId));

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    return { accessToken, refreshToken: newRefreshToken };
  }
}

export default new AuthService();
