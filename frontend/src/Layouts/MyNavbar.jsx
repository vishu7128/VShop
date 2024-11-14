import { Button, Navbar, Dropdown } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import Checkout from "../pages/Checkout";
import { useState } from "react";
import logo from "../assets/VShop_Logo.png";

export default function MyNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // Get user info from Redux state
  const userInfo = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  function logoutHandler() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img
          // src="https://flowbite.com/docs/images/logo.svg"
          src={logo}
          className="mr-3 lg:mx-10 lg:my-2"
          alt="Flowbite React Logo"
          width={100}
          height={70}
        />
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span> */}
      </Navbar.Brand>
      <div className="flex md:order-2">
        {userInfo ? (
          <Dropdown label="User" dismissOnClick={false}>
            <Dropdown.Item onClick={() => navigate("/profile")}>
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/orders/history")}>
              Orders
            </Dropdown.Item>
            <Dropdown.Item onClick={logoutHandler}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="ml-2 size-10 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <p className="mr-2">{cartQuantity}</p>
        <Checkout open={open} setOpen={setOpen} />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          href="#"
          active
          onClick={() => navigate("/")}
          className="text-xl"
        >
          Home
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
