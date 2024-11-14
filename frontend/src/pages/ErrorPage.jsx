/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function ErrorPage({ statusCode, message }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-xl text-gray-700 mb-6">
          {statusCode ? `Error ${statusCode}:` : "Something went wrong."}
        </p>
        <p className="text-lg text-gray-600 mb-6">
          {message ||
            "We encountered an unexpected issue. Please try again later."}
        </p>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 font-medium text-lg"
        >
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
