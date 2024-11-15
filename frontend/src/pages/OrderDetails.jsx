import Layouts from "../Layouts/Layouts";
import { getOrderDetails } from "../store/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const dispatch = useDispatch();
  const orderId = useParams().orderId;
  const { orderDetails: order, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Layouts>
      <div>
        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Order Items
          </h2>
        </div>
        {error ? (
          <h1>Order doesn&apos;t exists</h1>
        ) : (
          <ul className="max-w-3xl mx-auto my-8 space-y-6">
            {order?.orderItems?.map((orderItem) => (
              <li
                key={orderItem.id}
                className="p-6 bg-white border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl dark:bg-gray-900 dark:border-gray-700 transition-shadow"
              >
                <div className="flex items-center space-x-8 rtl:space-x-reverse">
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <img
                      className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
                      src={orderItem.image || "default-image-url.jpg"}
                      alt={orderItem.name}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {orderItem.name}
                    </h3>
                    <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
                      Quantity:{" "}
                      <span className="font-medium">{orderItem.quantity}</span>
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${orderItem.price.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layouts>
  );
}

export default OrderDetails;
