import Layouts from "../Layouts/Layouts";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // Import useState for managing form visibility
import { updatePassword } from "../store/authSlice";

function Profile() {
  const userInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const passwordMatches = passwords.newPass === passwords.confirmPass;

  function handleChangeEvents(key, e) {
    const updatedPass = { ...passwords };
    updatedPass[key] = e.target.value;
    setPasswords(updatedPass);
  }

  // State to track if the password change form is visible
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  // Handle change password form visibility
  const handleChangePasswordClick = () => {
    setIsChangePasswordVisible(true);
  };

  // Handle logout
  function logoutHandler() {
    dispatch(logout());
    navigate("/login");
  }

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // Dispatch the login action with email, and password
    dispatch(
      updatePassword({ email: userInfo.email, password: passwords.newPass })
    );
    navigate("/");
  };

  return (
    <Layouts>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            alt="User image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userInfo.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.email}
          </span>

          {!isChangePasswordVisible && (
            <div className="flex mt-4 md:mt-6">
              {/* Change Password Button */}
              <button
                onClick={handleChangePasswordClick}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-[#155E75] rounded-lg hover:bg-[#0C3F4F] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isChangePasswordVisible} // Disable if the form is visible
              >
                Change Password
              </button>

              {/* Log Out Button */}
              <a
                onClick={logoutHandler}
                href="#"
                className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-[#155E75] focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Log Out
              </a>
            </div>
          )}

          {/* Change Password Form (Conditionally Rendered) */}
          {isChangePasswordVisible && (
            <div className="mt-4 w-full bg-gray-100 p-4 rounded-lg">
              <h6 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h6>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    onChange={(e) => handleChangeEvents("newPass", e)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    onChange={(e) => handleChangeEvents("confirmPass", e)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={!passwordMatches}
                    onClick={handleSave}
                    type="submit"
                    className={`px-4 py-2 text-sm font-medium text-white bg-[#155E75] rounded-lg hover:bg-[#0C3F4F] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                      !passwordMatches
                        ? "cursor-not-allowed bg-[gray] hover:bg-[gray]"
                        : "cursor-pointer"
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layouts>
  );
}

export default Profile;
