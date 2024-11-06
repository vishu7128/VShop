/* eslint-disable react-hooks/exhaustive-deps */
import Layouts from "../Layouts/Layouts";
import {
  Button,
  // Checkbox,
  Card,
  Label,
  TextInput,
  Alert,
} from "flowbite-react"; // Import Alert from flowbite-react
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { useState, useEffect } from "react"; // Import useState and useEffect
import { login, clearError } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate(); // Create a navigate function for redirection
  const userInfoFromState = useSelector((state) => state.auth.user);

  // Check localStorage if user info is not available in Redux state
  const userInfo =
    userInfoFromState || JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    // Redirect if userInfo is present
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const dispatch = useDispatch(); // Create a dispatch function

  const { error, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // Dispatch the login action with email, and password
    await dispatch(login({ email, password }));
    setPassword(""); // Clear the password field after attempting login
  };

  useEffect(() => {
    // Redirect to home page if login is successful
    if (user) {
      navigate("/"); // Adjust the route as needed
    }

    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]); // Dependencies ensure the effect runs when `user` changes

  return (
    <Layouts>
      <Card className="max-w-sm w-full">
        {error && (
          <Alert color="failure" className="mb-4">
            <span>{error}</span>
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@VShop.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your Password" />
            </div>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div> */}
          <div className="flex items-center gap-2">
            <p className="text-base font-sans text-gray-900">New to VShop?</p>
            <Link
              className="hover:text-[#0E7490] hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </Link>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </Layouts>
  );
}

export default Login;
