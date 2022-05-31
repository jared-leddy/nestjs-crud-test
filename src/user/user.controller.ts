// NPM Modules
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller('users')
export class UserController {
    @UseGuards(AuthGuard('jwt-guard'))
    @Get('me')
    getMe(@Req() req: Request) {
        // get current user from token

        return req.user;
    }
}