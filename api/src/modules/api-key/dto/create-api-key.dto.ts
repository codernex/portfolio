import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export enum ApiOrigin {
  google = 'google',
  nonce = 'nonce-storage',
}

const validOrigin = ['google', 'nonce-storage'] as const;

export function IsValidOrigin(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidOrigin',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const origin = validOrigin as unknown as string;

          const isAcceptedOrigin = origin.includes(value);
          const isUrl =
            value.startsWith('https://') || value.startsWith('http://');

          return isAcceptedOrigin || isUrl;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid origin or a URL`;
        },
      },
    });
  };
}

export class CreateApiKey {
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  @IsValidOrigin()
  orgin: string;

  @IsNotEmpty()
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @IsArray()
  scope?: string[];
}
