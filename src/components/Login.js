import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Hide login message when login button is clicked
    setLoginMessage('');
    
    setLoading(true); // Show spinner
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoginMessage(`Welcome ${user.email}!`);
      navigate('/notes');
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = '';

      switch (errorCode) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address. Please check your email.';
          break;
        default:
          errorMessage = 'Login failed. Please check your credentials.';
          break;
      }

      setLoginMessage(errorMessage);
    } finally {
      setLoading(false); // Hide spinner after response
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center">LOGIN</h4>
              <br />
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                </button>
                <div className="text-center mb-2">
                  <p className="m-3 small">
                    Don't have an account? Register <Link to="/register">here</Link>
                  </p>
                </div>
              </form>
              {loginMessage && <div className="mt-3 alert alert-info">{loginMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;