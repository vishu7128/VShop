import ProtectedRoute from "../Layouts/ProtectedRoute";
import Layouts from "../Layouts/Layouts";
import CartItems from "../components/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../utils/configureAxios";
import { createOrder } from "../store/orderSlice";
import { saveShippingAddress } from "../store/cartSlice";

function PlaceOrder() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const savedShippingAddress = useSelector(
    (state) => state.cart.shippingAddress
  );
  const userInfo = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const subTotalPrice = cartItems
    .reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
    .toFixed(2);

  const shippingPrice = subTotalPrice > 100 ? 0 : 20;
  const totalPrice = (+subTotalPrice + +shippingPrice).toFixed(2);

  const [shippingAddress, setShippingAddress] = useState({
    address: "hinjewad",
    city: "Pune",
    postalCode: "411057",
    country: "India",
  });

  const handleAddressChange = function (e, key) {
    const value = e.target.value;
    let updatedAddress = { ...shippingAddress };
    updatedAddress[key] = value;
    setShippingAddress(updatedAddress);
  };

  const [paypalClientId, setPaypalClientId] = useState(null);

  useEffect(() => {
    const fetchPaypalClientId = async () => {
      try {
        const response = await api.get(`/api/config/paypal`);
        const clientId = response.data.clientId;
        setPaypalClientId(clientId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaypalClientId();
  }, []);

  const successPaymentHandler = async (details) => {
    // Transform cartItems to match the orderItemSchema structure
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id, // Use _id as the product field to match the schema
    }));

    const orderData = {
      orderItems,
      shippingAddress: savedShippingAddress,
      paymentMethod: "Paypal",
      totalPrice,
      shippingPrice,
      paymentResult: {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.payer.email_address,
      },
    };

    // Dispatch createOrder to save the order in the backend
    dispatch(createOrder(orderData));
  };

  const handlePayPalCreateOrder = (data, actions) => {
    // Ensure the shipping address is saved in Redux before creating the order
    dispatch(
      saveShippingAddress({
        userId: userInfo.id,
        shippingAddress,
      })
    );

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice,
          },
        },
      ],
    });
  };

  console.log(shippingAddress);
  return (
    <ProtectedRoute>
      <Layouts>
        <section className="w-full text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-24 mx-auto">
            <div className="w-full mx-auto flex flex-col lg:flex-row gap-8">
              {/* Shipping Address Section */}
              <div className="w-full lg:w-1/2 lg:py-6 bg-white flex flex-col">
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                  Shipping Address
                </h2>
                <div className="relative mb-4">
                  <label
                    htmlFor="address"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange(e, "address")}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    htmlFor="city"
                    className="leading-7 text-sm text-gray-600"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange(e, "city")}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    htmlFor="postalCode"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange(e, "postalCode")}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    htmlFor="country"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange(e, "country")}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              {/* Order Summary Section */}
              <div className="w-full lg:w-1/2 lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  Order Summary
                </h2>
                <CartItems />
                <div className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">Shipping Price</span>
                  <span className="ml-auto text-gray-900">
                    ₹{shippingPrice}
                  </span>
                </div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>
                {paypalClientId && (
                  <div className="mt-5">
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        disabled={
                          !shippingAddress.address ||
                          !shippingAddress.city ||
                          !shippingAddress.country ||
                          !shippingAddress.postalCode
                        }
                        createOrder={handlePayPalCreateOrder}
                        onApprove={(data, actions) => {
                          return actions.order
                            .capture()
                            .then(successPaymentHandler);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layouts>
    </ProtectedRoute>
  );
}

export default PlaceOrder;
