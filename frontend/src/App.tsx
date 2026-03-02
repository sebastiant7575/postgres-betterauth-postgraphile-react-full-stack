import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { authClient } from "./lib/auth-client";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const session = authClient.useSession();

  const handleSignUp = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const {} = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          setMessage("Signed up successfully!");
        },
        onError: (ctx) => {
          // display the error message
          setMessage(`Error: ${ctx.error.message}`);
          alert(ctx.error.message);
        },
      },
    );
  };

  const handleSignIn = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const result = await authClient.signIn.email({
      email,
      password,
    });
    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Signed in successfully!");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setMessage("Signed out.");
  };

  if (session.data) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Welcome, {session.data.user.name}</h1>
        <p>Email: {session.data.user.email}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <>
      <h1>Vite + React</h1>
      <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "0.5rem",
            alignItems: "flex-start",
          }}
        >
          <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
          {isSuccess && <p>Sign Up Successful</p>}
          {message && <p style={{ color: "red" }}>{message}</p>}

          {!isLogin && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                flexDirection: "column",
              }}
            >
              <p>Name:</p>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              ></input>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              flexDirection: "column",
            }}
          >
            <p>Email:</p>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              flexDirection: "column",
            }}
          >
            <p>Password:</p>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            ></input>
          </div>
          <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
          <p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Sign In"}
            </a>
          </p>
        </div>
      </form>
    </>
  );
}

export default App;
