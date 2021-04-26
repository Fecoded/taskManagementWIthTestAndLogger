import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    private logger = new Logger("AuthService");
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
      return this.userRepository.signUp(authCredentialsDTO);
    }

    async login(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDTO)
        
        if(!username){
            throw new UnauthorizedException("Invalid Credentials");
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`)

        return { accessToken }

    }

}
