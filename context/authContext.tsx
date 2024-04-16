import React, { Context } from "react";

export const AuthStateContext = React.createContext<AuthState | null>({ authData: undefined, email: undefined, codeRequested: undefined, guestAuthData: undefined, tempEmail: undefined, userId: undefined, userLockedOut: false, userType: undefined });

type AuthState = {
    email?: string,
    authData?: AuthData,
    guestAuthData?: AuthData,
    codeRequested?: boolean,
    tempEmail?: string,
    userId?: string,
    userLockedOut?: boolean,
    userType?: UserType
}

export type AuthData = {
    access_token?: string,
    expires_in?: number,
    refresh_token?: string,
    scope?: string,
    token_type?: string,
}

export enum UserType {
    NotAuthenticatedUser = 'NotAunthenticatedUser',
    GuestUser = 'guest',
    AuthenticatedUser = 'main'
}

export function useAuthState() {
    const data = React.useContext<AuthState>(AuthStateContext as Context<AuthState>);

    if (data === undefined) {
        throw new Error('useAuthState must be used within a AuthStateProvider');
    }

    return data;
}