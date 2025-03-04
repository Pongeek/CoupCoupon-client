import { RESET_STORE } from "./ResetStore";

export class authState{
    id: number = 0;
    email: string = "";
    name: string = "";
    userType: string = "";
    token: string = "";
    isLoggedIn: boolean = false;
}

export enum AuthActionType {
    login = "login",
    logout = "logout",
    updateToken = "updateToken",
    rehydrate = "rehydrate",
}

export interface AuthAction {
    type: AuthActionType | typeof RESET_STORE,
    payload?: any
}

export function loginAction(user: authState): AuthAction {
    localStorage.setItem('auth', JSON.stringify(user)); // Persist state
    return { type: AuthActionType.login, payload: user }
}

export function logoutAction(): AuthAction {
    localStorage.removeItem('auth'); // Clear persisted state
    return { type: AuthActionType.logout }
}

export function updateTokenAction(token: string): AuthAction {

    return { type: AuthActionType.updateToken, payload: token }
}

export function rehydrateAuthState(): AuthAction {
    const persistedState = localStorage.getItem('auth');
    if (persistedState) {
        return { type: AuthActionType.rehydrate, payload: JSON.parse(persistedState) };
    }
    return { type: AuthActionType.rehydrate, payload: new authState() };
}

export function AuthReducer(currentState: authState = new authState(), action: AuthAction): authState {
    let newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.login:
            newState = action.payload;
            break;
            
        case AuthActionType.logout:
            newState = new authState();
            break;

        case AuthActionType.updateToken:
            newState.token = action.payload;
            break;

        case AuthActionType.rehydrate:
            newState = action.payload;
            break;

        case RESET_STORE:
            newState = new authState();
            break;
    }
    return newState;
}

