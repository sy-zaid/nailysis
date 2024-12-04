import "./App.css";

function App() {
  return (
    <div className="container">
      <div className="picture">
        <img src="pic.png" alt="Illustration" />
      </div>

      <div className="form">
        <section className="main">
          <h2>Create Your Account</h2>
          <form>
            <div className="input-row">
              <div className="input-group half-width">
                <label htmlFor="first-name">First Name</label>
                <input
                  type="text"
                  id="first-name"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="input-group half-width">
                <label htmlFor="last-name">Last Name</label>
                <input
                  type="text"
                  id="last-name"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          <p>or</p>
          <div className="social-login">
            <button className="social-button google-button">
              <img src="google.png" alt="Google" className="social-icon" />
              Continue With Google
            </button>
            <button className="social-button facebook-button">
              <img src="facebook.png" alt="Facebook" className="social-icon" />
              Continue With Facebook
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
