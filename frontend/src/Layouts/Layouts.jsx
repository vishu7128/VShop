/* eslint-disable react/prop-types */
import MyNavbar from "./MyNavbar";
import MyFooter from "./MyFooter";

function Layouts({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <MyNavbar />
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
      <MyFooter />
    </div>
  );
}

export default Layouts;
