import { useEffect } from "react";
import Layouts from "../Layouts/Layouts";
import { useDispatch, useSelector } from "react-redux";
import { getOrderList } from "../store/orderSlice";

function OrdersHistory() {
  const dispatch = useDispatch();
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
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {orderList.map((order) => {
                  return (
                    <div
                      key={order._id}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 py-6" // Add gap-x-8 for column spacing
                    >
                      <dl className="lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Order ID:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          <a href="#" className="hover:underline">
                            {order._id}
                          </a>
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Date:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          {formatDate(order.createdAt)}
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Price:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          ${order.totalPrice}
                        </dd>
                      </dl>

                      <dl className="lg:flex-1">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Status:
                        </dt>
                        <dd className="mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-s font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                          {order.isDelivered ? "Delivered" : "Shipping"}
                        </dd>
                      </dl>

                      <div className="col-span-full sm:col-span-2 lg:flex lg:w-auto lg:justify-end gap-4">
                        <button
                          type="button"
                          className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                        >
                          Cancel order
                        </button>
                        <a
                          href="#"
                          className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                        >
                          View details
                        </a>
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
