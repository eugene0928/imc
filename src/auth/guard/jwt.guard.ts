import { AuthGuard } from "@nestjs/passport";

export class SuperJwtGuard extends AuthGuard("superjwt") {
    constructor() {
        super()
    }
}

export class AdminJwtGuard extends AuthGuard("adminjwt") {
    constructor() {
        super()
    }
}

export class TeacherJwtGuard extends AuthGuard("teacherjwt") {
    constructor() {
        super()
    }
}

export class StudentJwtGuard extends AuthGuard("studentwt") {
    constructor() {
        super()
    }
}