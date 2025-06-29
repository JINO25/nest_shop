/* eslint-disable prettier/prettier */
export interface ActiveUserData {
    /**
     * The ID of the user
     */
    sub: number;

    /**
     * User's email address
     */
    email: string;
    role: string;
}