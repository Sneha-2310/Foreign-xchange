import { CanActivate, ExecutionContext } from "@nestjs/common";

export class RolesGuard implements CanActivate{

    private rolePassed:string;

    constructor(role:string){
        this.rolePassed=role;
    }

    canActivate(context: ExecutionContext): boolean  {
        const ctx=context.switchToHttp();
        const request:any=ctx.getRequest<Request>();
       // console.log(this.rolePassed,request.user.role);
        return this.rolePassed==request.user.role;
    }
}