
export interface LoginResponse {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
}


export interface IdToken {
    sub: string;
    name: string;
    exp: number;
    iat: number;
    fullname: string;
    firstName: string;
    lastName: string;
    orgName: string;
    jobtitle: string;
    email: string;
    phone: string;
    role: string;
    // permission: PermissionValues | PermissionValues[];
    configuration: string;
}