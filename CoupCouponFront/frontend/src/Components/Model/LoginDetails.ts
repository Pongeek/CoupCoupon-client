export class LoginDetails{
    public email: string;
    public password: string;
    public userType: string

    constructor(email: string, password: string, userType: string){
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

}

