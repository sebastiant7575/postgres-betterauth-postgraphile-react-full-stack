import { useState } from "react";
import { authClient } from "./lib/auth-client";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const session = authClient.useSession();

  const handleSignUp = async () => {
    const result = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Signed up successfully!");
    }
  };

  const handleSignIn = async () => {
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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>

      {!isLogin && (
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />
      <button onClick={isLogin ? handleSignIn : handleSignUp}>
        {isLogin ? "Sign In" : "Sign Up"}
      </button>

      <p>{message}</p>

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
  );
}

export default App;
