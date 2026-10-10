import { CanActivate, ExecutionContext, Injectable, UnauthorizedException }
    from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwt: JwtService) { }
    
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest<any>();
        // libera preflight CORS
        const method = (req.method || '').toUpperCase();
        if (method === 'OPTIONS') return true;
        const path = String(req.path || req.url || '').split('?')[0];
        const isPublicAuthRoute =
            (method === 'POST' && (path === '/api/auth/login' || path === '/api/auth/register'));
        const isPublicCatalogRoute = method === 'GET' && /^\/api\/(games|categories|plans)(\/|$)/.test(path);
        if (isPublicAuthRoute || isPublicCatalogRoute) return true;
        // exige Authorization: Bearer <token>
        const auth = String(req.headers?.authorization || '');
        if (!auth.startsWith('Bearer ')) {
            throw new UnauthorizedException('Bearer token ausente');
        }
        const token = auth.slice(7).trim();
        try {
            req.user = this.jwt.verify(token); // valida assinatura/expiração
            return true;
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}
