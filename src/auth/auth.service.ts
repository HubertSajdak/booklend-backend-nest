import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { I18n, I18nContext } from 'nestjs-i18n';
import * as path from 'path';
import { Admin } from 'src/admin/schemas/admin.schema';
import { SignInAdminDto } from './input/signin-admin.dto';
import { SignUpAdminDto } from './input/signup-admin.dto';
import { UpdateAdminDto } from './input/update-admin.dto';
import { UpdateAdminPasswordDto } from './input/updatePassword-admin.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    @I18n() i18n: I18nContext,
    signUpDto: SignUpAdminDto,
  ): Promise<{ message: string }> {
    Logger.log(signUpDto);
    const { email, firstName, lastName, password } = signUpDto;
    if (!email || !firstName || !lastName || !password) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.badObject')],
      });
    }
    const existingAdmin = await this.adminModel.findOne({
      email: signUpDto.email,
    });
    Logger.log(existingAdmin);

    if (existingAdmin) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('admin.emailExists')],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminModel.create({
      ...signUpDto,
      password: hashedPassword,
    });
    return { message: i18n.t('admin.adminCreated') };
  }
  async signIn(
    @I18n() i18n: I18nContext,
    signInDto: SignInAdminDto,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const { email, password } = signInDto;
    const existingAdmin = await this.adminModel.findOne({ email });
    if (!existingAdmin) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Not Found',
        errors: [i18n.t('admin.emailNotFound')],
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingAdmin.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: [i18n.t('admin.invalidCredentials')],
      });
    }
    const accessToken = this.jwtService.sign(
      {
        userId: existingAdmin._id,
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_LIFETIME,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: existingAdmin._id,
        firstName: existingAdmin.firstName,
        lastName: existingAdmin.lastName,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_LIFETIME,
      },
    );
    return {
      message: `${i18n.t('admin.welcome')} ${existingAdmin.firstName}`,
      accessToken,
      refreshToken,
    };
  }
  async updateAdminInfo(
    req,
    @I18n() i18n: I18nContext,
    updateAdminInfoDto: UpdateAdminDto,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    const { email, firstName, lastName } = updateAdminInfoDto;
    if (!email || !firstName || !lastName) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    const existingAdmin = await this.adminModel
      .findOne({ _id: userId })
      .select('-password');
    if (!existingAdmin) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: [i18n.t('auth.unauthorized')],
      });
    }
    await this.adminModel.updateOne({ _id: userId }, { ...updateAdminInfoDto });
    return { message: i18n.t('admin.infoUpdated') };
  }
  async getAdminData(req, @I18n() i18n: I18nContext): Promise<Admin> {
    const user = req.user;
    const existingAdmin = await this.adminModel
      .findOne({ _id: user.userId })
      .select('-password');
    if (!existingAdmin) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: [i18n.t('auth.unauthorized')],
      });
    }
    return existingAdmin;
  }
  async updateAdminPassword(
    req,
    @I18n() i18n: I18nContext,
    updateAdminPasswordDto: UpdateAdminPasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user;
    const { password, confirmPassword } = updateAdminPasswordDto;
    const existingAdmin = await this.adminModel
      .findOne({ _id: user.userId })
      .select('-password');
    if (password !== confirmPassword) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.confirmPassword.invalidConfirmPassword')],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();
    return {
      message: i18n.t('admin.passwordUpdated'),
    };
  }
  async refreshToken(
    @I18n() i18n: I18nContext,
    input: {
      refreshToken: string;
    },
  ): Promise<{ accessToken: string }> {
    if (!input.refreshToken) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.common.badObject')],
      });
    }
    try {
      await this.jwtService.verify(input.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const decoded: any = this.jwtService.decode(input.refreshToken);
      const newAccessToken = this.jwtService.sign(
        {
          userId: decoded.userId,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
        },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_LIFETIME },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        errors: [i18n.t('auth.sessionExpired')],
      });
    }
  }
  async uploadAdminPhoto(i18n, file, req) {
    const { userId } = req.user;
    try {
      const existingAdmin = await this.adminModel.findOne({ _id: userId });
      if (!existingAdmin) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Not Found',
          errors: [i18n.t('admin.adminNotFound')],
        });
      }
      if (!file) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          errors: [i18n.t('validation.file.noFileUploaded')],
        });
      }
      if (!file.mimetype.startsWith('image')) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          errors: [i18n.t('validation.file.badFormat')],
        });
      }
      const filePath = `/uploads/${file.originalname}`;
      await this.adminModel.updateOne({ _id: userId }, { photo: filePath });
      return {
        status: 201,
        message: i18n.t('validation.file.fileUploadedSuccessfully'),
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        message: 'Internal Server Error',
        errors: [i18n.t('validation.file.somethingWentWrong')],
      });
    }
  }
  async deleteAdminPhoto(i18n, req) {
    const { userId } = req.user;
    const existingAdmin = await this.adminModel.findOne({ _id: userId });
    if (!existingAdmin.photo) {
      throw new UnprocessableEntityException({
        status: 400,
        message: 'Bad Request',
        errors: [i18n.t('validation.badObject')],
      });
    }
    await this.adminModel.updateOne({ _id: userId }, { photo: null });
    const pathName = path.join(
      __dirname + '../../..' + `/uploads/${existingAdmin.photo.split('/')[2]}`,
    );
    const fileExists = fs.existsSync(pathName);
    if (!fileExists) {
      throw new BadRequestException({
        status: 500,
        message: 'Internal Server Error',
        errors: [i18n.t('validation.file.noFilesToRemove')],
      });
    }
    fs.unlink(pathName, (err) => {
      if (err) {
        Logger.log(err);
        throw new InternalServerErrorException({
          status: 500,
          message: 'Internal Server Error',
          errors: [i18n.t('validation.file.somethingWentWrong')],
        });
      }
    });
    return { message: i18n.t('validation.file.fileRemovedSuccessfully') };
  }

  async deleteAdmin(i18n, req) {
    const { userId } = req.user;
    const existingAdmin = await this.adminModel.findOne({
      _id: userId,
    });
    if (!existingAdmin) {
      throw new NotFoundException({
        status: 404,
        message: 'Not found',
        errors: [i18n.t('admin.adminNotFound')],
      });
    }
    await this.adminModel.deleteOne({ _id: userId });
    return { message: i18n.t('admin.adminDeleted') };
  }
}
