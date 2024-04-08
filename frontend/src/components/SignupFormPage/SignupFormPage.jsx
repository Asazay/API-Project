import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./SignupForm.css";
import { Navigate } from "react-router-dom";

const SignupFormPage = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      sessionActions.signUp({ username, firstName, lastName, email, password })
    ).catch(async (res) => {
      const data = await res.json();
      if (data?.errors) {
        if (password !== confirmPassword) {
          setErrors({
            ...data.errors,
            confirmPassword:
              "Confirm Password field must be the same as the Password field",
          });
        } else setErrors(data.errors);
      }
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div id="usernameDiv">
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div id="firstNameDiv">
          <label>First name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div id="lastNameDiv">
          <label>Last name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div id="emailDiv">
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div id="passwordDiv">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div id="confirmPasswordDiv">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <div id="submitBtnDiv">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </>
  );
};

export default SignupFormPage;
