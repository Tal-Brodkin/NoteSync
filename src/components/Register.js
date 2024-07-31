import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Hide registration message when register button is clicked
    setRegisterMessage('');
    
    setLoading(true); // Show spinner
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setRegisterMessage('Registration successful! Please log in.');
      navigate('/notes');
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = '';

      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address. Please check your email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = 'Registration failed. Please try again.';
          break;
      }

      setRegisterMessage(errorMessage);
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
              <h4 className="card-title text-center">REGISTER</h4>
              <br />
              <form onSubmit={handleRegister}>
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
                  {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                </button>
              </form>
              {registerMessage && <div className="mt-3 alert alert-info">{registerMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;