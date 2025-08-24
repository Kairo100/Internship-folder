import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;

  async verifyRecaptcha(token: string): Promise<boolean> {
    if (!this.secretKey) {
      throw new HttpException(
        'reCAPTCHA secret key not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!token) {
      throw new HttpException(
        'reCAPTCHA token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: this.secretKey,
            response: token,
          },
        },
      );

      const { success } = response.data;

      // For reCAPTCHA v2, we only need to check success
      // For reCAPTCHA v3, you might also want to check the score
      if (!success) {
        throw new HttpException(
          'reCAPTCHA verification failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'reCAPTCHA verification service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
