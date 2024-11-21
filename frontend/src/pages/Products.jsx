import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice.js"; // Ensure this action is correct
import { Link } from "react-router-dom";

// Custom debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer); // Clear the previous timer
    timer = setTimeout(() => {
      func(...args); // Call the function after the delay
    }, delay);
  };
};

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector(
    (state) => state.products
  );

  const [page, setPage] = useState(1);
  const limit = 10; // Adjust the limit as needed

  // Create a debounced version of the fetch function
  const fetchDebouncedProducts = useCallback(
    debounce((page) => {
      dispatch(fetchProducts({ page, limit }));
    }, 300),
    [dispatch, limit]
  );

  // Fetch products whenever page changes
  useEffect(() => {
    fetchDebouncedProducts(page);
  }, [page, fetchDebouncedProducts]);

  // Debounced infinite scrolling
  const handleScroll = useCallback(
    debounce(() => {
      const userScrolledToBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 50; // Threshold to avoid triggering early

      if (userScrolledToBottom && !loading && page < totalPages) {
        setPage((prevPage) => prevPage + 1); // Increment page
      }
    }, 300), // 300ms debounce delay
    [loading, page, totalPages]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (loading && page === 1) return <div>Loading...</div>; // Show loading only if it's the first page
  if (error) return <div>Error: {error}</div>;

  // Render products list
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {products.map((product) => (
            <div key={product._id} className="p-4 lg:w-1/4 md:w-1/2">
              <Link to={`/products/${product._id}`}>
                <div className="bg-white">
                  <div className="max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                      <div className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                          <img
                            src={product.image}
                            alt={`${product.name}`}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-700">
                              <a href="#">
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                ></span>
                                {product.name}
                              </a>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {`Review count: ${product.numOfReviews}`}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Show a loading spinner when fetching more products */}
        {loading && page > 1 && (
          <div className="text-center">Loading more...</div>
        )}
      </div>
    </section>
  );
};

export default Products;
