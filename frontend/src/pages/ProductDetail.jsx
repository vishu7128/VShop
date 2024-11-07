/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetail } from "../store/productsSlice"; // Import the action
import Layouts from "../Layouts/Layouts";
import { addToCart, removeFromCart } from "../store/cartSlice";

function ProductDetail() {
  const { id: prodId } = useParams();
  const dispatch = useDispatch();
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.products);
  const {
    loading: cartLoading,
    error: cartError,
    cartItems,
  } = useSelector((state) => state.cart);
  const quantity = useRef();

  useEffect(() => {
    dispatch(fetchProductDetail(prodId)); // Fetch product detail on component mount
  }, [dispatch, prodId]);

  if (productLoading) {
    return (
      <Layouts>
        <div>Loading...</div>
      </Layouts>
    );
  }

  if (productError) {
    return (
      <Layouts>
        <div>Error: {productError}</div>
      </Layouts>
    );
  }

  const handleQuantityChange = (e) => {
    quantity.current = e.target.value;
  };
  const handleAddToCart = () => {
    dispatch(addToCart({ id: prodId, quantity: +quantity.current || 1 }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(prodId)); // Dispatch with the product ID
  };

  return (
    <Layouts>
      <section>
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <img
                alt="ecommerce"
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                src={product.image}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  {product.name.split(" ")[0]}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {product.name}
                </h1>
                <div className="flex mb-4">
                  <span className="flex items-center">
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-indigo-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span className="text-gray-600 ml-3">
                      {product.numOfReviews} Reviews
                    </span>
                  </span>
                </div>
                <p className="leading-relaxed">{product.description}</p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                  <div className="flex items-center">
                    <span className="mr-3">Quantity</span>
                    <div className="relative">
                      <select
                        disabled={product.noOfStock == 0}
                        onChange={handleQuantityChange}
                        className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                      >
                        {Array.from(
                          {
                            length:
                              product.noOfStock < 5 ? product.noOfStock : 5,
                          },
                          (_, index) => (
                            <option key={index}>{index + 1}</option>
                          )
                        )}
                      </select>
                      <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ${product.price}
                  </span>

                  {product.noOfStock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(quantity.current)}
                      disabled={!product.noOfStock}
                      className={`flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded ${
                        cartLoading ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  ) : (
                    <button
                      disabled={cartLoading || !product.noOfStock}
                      className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layouts>
  );
}

export default ProductDetail;
