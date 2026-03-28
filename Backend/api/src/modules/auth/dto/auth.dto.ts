import { createZodDto } from 'nestjs-zod';
import { LoginSchema } from './auth.validator';

export class LoginDTO extends createZodDto(LoginSchema) { }
