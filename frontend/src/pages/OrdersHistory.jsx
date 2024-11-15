import { useEffect } from "react";
import Layouts from "../Layouts/Layouts";
import { useDispatch, useSelector } from "react-redux";
import { getOrderList } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";

function OrdersHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderList = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(getOrderList());
  }, []);

  function formatDate(dateString) {
    // Convert to Date object
    const date = new Date(dateString);

    // Define format options
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    // Format the date
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  return (
    <Layouts>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 self-start">
        <div className="mx-auto max-w-screen-lg px-6 2xl:px-8">
          <div className="mx-auto max-w-screen-lg lg:max-w-screen-xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My orders
              </h2>
            </div>

            <div className="mt-6 flow-root sm:mt-8">
              <div className="space-y-6">
                {orderList.map((order) => {
                  return (
                    <div
                      key={order._id}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-4 p-6 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                    >
                      <dl className="lg:flex-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Order ID:
                        </dt>
                        <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                          <a href="#" className="hover:underline">
                            {order._id}
                          </a>
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Date:
                        </dt>
                        <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                          {formatDate(order.createdAt)}
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Price:
                        </dt>
                        <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                          ${order.totalPrice}
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status:
                        </dt>
                        <dd
                          className={`mt-1.5 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            order.isDelivered
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Shipping"}
                        </dd>
                      </dl>

                      {/* View Details Button */}
                      <div className="flex items-center justify-end lg:col-span-1">
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="inline-flex items-center px-4 py-2 rounded-md border border-blue-600 bg-blue-600 text-white font-medium hover:bg-blue-700 hover:border-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                          View Items
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layouts>
  );
}

export default OrdersHistory;
