import "./login.css";

const login = () => {
  return (
    <div className="container">
      <div className="picture">
        <img src="/pic.png" alt="illustration" />
      </div>
      <div className="form">
        <section className="main">
          <h2>Welcome Back!</h2>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <h5 className="forgot-password">Forgot Password?</h5>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p>or</p>
          <div className="social-login">
            <button className="social-button google-button">
              <img src="/google.png" alt="Google" className="social-icon" />
              Continue With Google
            </button>
            <button className="social-button facebook-button">
              <img src="/facebook.png" alt="Facebook" className="social-icon" />
              Continue With Facebook
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default login;
