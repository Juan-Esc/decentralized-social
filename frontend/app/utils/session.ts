export class AuthSession {
    constructor(private window: Window) {}

    get authData() {
        return JSON.parse(this.window.localStorage.getItem("authData")?.toString() || "{}");
    }

    set authData(data: AuthData) {
        this.window.localStorage.setItem("authData", JSON.stringify(data));
    }

    public isLoggedIn() : boolean {
        return (this.window.localStorage.getItem("authData")) ? true : false;
    }

    public logout() {
        this.window.localStorage.removeItem("authData");
        return true;
    }
}

export interface AuthData {
    username : string;
    desoPubAddress : string;
    desoUsername? : string;
    ethPubAddress : string;
    // profilePicUrl? : string;
}