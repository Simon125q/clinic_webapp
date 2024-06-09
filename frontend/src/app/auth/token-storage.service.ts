import {inject, Injectable, PLATFORM_ID} from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
    providedIn: 'root'
})

export class TokenStorageService {
    private roles: Array<string> = [];
    private readonly platformId = inject(PLATFORM_ID);
    constructor() { }

    signOut() {
        window.sessionStorage.clear();
    }

    public saveToken(token: string) {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string {
        console.log(this.platformId);
        if (this.platformId != "server") {
            return sessionStorage.getItem(TOKEN_KEY) || '{}';
        }
        else {
            return '{}';
        }
    }

    public saveUsername(username: string) {
        window.sessionStorage.removeItem(USERNAME_KEY);
        window.sessionStorage.setItem(USERNAME_KEY, username);
    }

    public getUsername(): string {
        if (this.platformId != "server") {
            return sessionStorage.getItem(USERNAME_KEY) || '{}';
        }
        else {
            return '{}';
        }
    }

    public saveAuthorities(authorities: string[]) {
        window.sessionStorage.removeItem(AUTHORITIES_KEY);
        window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
    }

    public getAuthorities(): string[] {
        this.roles = [];

        if (this.platformId != "server") {
            if (sessionStorage.getItem(TOKEN_KEY)) {
                JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY) || '{}').forEach((authority: { authority: string; }) => {
                    this.roles.push(authority.authority);
                });
            }
        }

        return this.roles;
    }
}
