import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await registerUser({
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-panel">
        <div className="register-intro">
          <p className="register-eyebrow">
            Begin Your Journey
          </p>

          <h1>Build a Collection Worth Remembering</h1>

          <p className="register-description">
            Create your VinoVault account to collect wines,
            capture tasting experiences, and follow your wine
            journey over time.
          </p>

          <p className="register-tagline">
            Discover. Collect. Remember.
          </p>
        </div>

        <div className="register-form-panel">
          <div className="register-form-heading">
            <p>VinoVault</p>

            <h2>Create Account</h2>

            <p>
              Start building your personal wine collection.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength="8"
                required
              />

              <p className="register-field-helper">
                Use at least 8 characters.
              </p>
            </div>

            {error && (
              <p className="register-error">
                {error}
              </p>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="register-login">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;