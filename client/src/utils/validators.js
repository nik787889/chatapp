// //
import { isValidUsername } from "6pp"


export const usernameValidator = (Username) => {
    if (!isValidUsername(Username)) {
        return {isValid: false, errorMessage: "Invaid Username"}
    }
}