import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState();
  const { closeModal, setOnModalClose } = useModal();

  useEffect(() => {
    if (
      !email.length ||
      !username.length ||
      !firstName.length ||
      !lastName.length ||
      !password.length ||
      !confirmPassword.length ||
      username.length < 4 ||
      password.length < 6
    ) {
      setDisable(true);
    } else setDisable(false);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      sessionActions.signUp({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    )
      .then(() => {setOnModalClose(window.location.reload()); closeModal()})
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          if(password !== confirmPassword) data.errors.confirmPassword = "Confirm password must match password"
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="signupModal">
      <form id="signupForm" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="fieldOpt">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="fieldOpt">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username..."
            required
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className="fieldOpt">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name..."
            required
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div className="fieldOpt">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name..."
            required
          />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div className="fieldOpt">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password..."
            required
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className="fieldOpt">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password..."
            required
          />
        </div>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button disabled={disable} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
