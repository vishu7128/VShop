/* eslint-disable no-unreachable */
function ErrorThrowing() {
  // Simulating an error
  throw new Error("Something went wrong in ErrorThrowing!");
  return <div>This will not be rendered.</div>;
}

export default ErrorThrowing;
