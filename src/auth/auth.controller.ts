import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    signUp(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO) {
        return this.authService.signUp(authCredentialsDTO);
    }

    @Post('/login')
    login(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string}> {
        return this.authService.login(authCredentialsDTO);
    }

}
