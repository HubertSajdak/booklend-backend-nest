import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Admin } from 'src/admin/schemas/admin.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload): Promise<Admin> {
    const { userId } = payload;
    const user = await this.adminModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: [
          this.i18n.t('auth.unauthorized', {
            lang: I18nContext.current().lang,
          }),
        ],
      });
    }
    return { ...payload };
  }
}
