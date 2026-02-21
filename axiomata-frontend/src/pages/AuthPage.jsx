import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


export default function AuthPage() {

    // login default
    const [mode, setMode] = useState("login")

    //read button press in header to setMode

    return (
        <div>
            {/* show current form*/}
            { mode === "login" ? <LoginForm /> : <RegisterForm />}


            {/* Toggle register/login */}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}
                >
                    {mode === "login" ? "Go to Register" : "Go to Login"}
            </button>
        </div>
    )
}