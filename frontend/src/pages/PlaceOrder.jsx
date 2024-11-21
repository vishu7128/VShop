import Layouts from "../Layouts/Layouts";
import CartItems from "../components/CartItems";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../utils/configureAxios";
import {
  clearOrderState,
  createOrder,
  saveShippingAddress,
} from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/cartSlice";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.user);
  const orderCreationStatus = useSelector(
    (state) => state.order.orderCreationStatus
  );

  if (orderCreationStatus === "success") {
    dispatch(clearOrderState());
    dispatch(clearCart());
    navigate("/orders/history");
  }

  const subTotalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const shippingPrice = subTotalPrice > 100 ? 0 : 20;
  const totalPrice = (+subTotalPrice + +shippingPrice).toFixed(2);

  // Helper function to load shipping address based on user ID
  const loadShippingAddress = (userId) => {
    const addresses =
      JSON.parse(localStorage.getItem("shippingAddresses")) || {};
    return addresses[userId] || null;
  };

  const [shippingAddress, setShippingAddress] = useState(
    loadShippingAddress(userInfo._id)
  );
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddressChange = (e, key) => {
    setShippingAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSaveAddress = () => {
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setErrorMessage("Please fill all fields before saving your address.");
      return;
    }

    setErrorMessage(""); // Clear any previous error message
    setIsAddressSaved(true);
    dispatch(saveShippingAddress({ userId: userInfo._id, shippingAddress }));
  };

  const [paypalClientId, setPaypalClientId] = useState(null);

  useEffect(() => {
    const fetchPaypalClientId = async () => {
      try {
        const response = await api.get(`/api/config/paypal`);
        setPaypalClientId(response.data.clientId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaypalClientId();
  }, []);

  const successPaymentHandler = async (details) => {
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id,
    }));

    // Get shipping address from localStorage
    const savedShippingAddress = JSON.parse(
      localStorage.getItem("shippingAddresses")
    );

    const orderData = {
      orderItems,
      shippingAddress: savedShippingAddress[userInfo._id], // Now using address from localStorage
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

    dispatch(createOrder(orderData));
  };

  const handlePayPalCreateOrder = (data, actions) => {
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

  return (
    <Layouts>
      <section className="w-full text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="w-full mx-auto flex flex-col lg:flex-row gap-8">
            {/* Shipping Address Section */}
            <div className="w-full lg:w-1/2 lg:py-6 bg-white flex flex-col">
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
                Shipping Address
              </h2>

              {errorMessage && (
                <div className="text-red-500 mb-4">{errorMessage}</div>
              )}

              {["address", "city", "postalCode", "country"].map(
                (field, index) => (
                  <div className="relative mb-4" key={index}>
                    <label
                      htmlFor={field}
                      className="leading-7 text-sm text-gray-600"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      disabled={isAddressSaved}
                      id={field}
                      name={field}
                      maxLength={field === "postalCode" ? 6 : 100}
                      value={
                        shippingAddress && shippingAddress[field]
                          ? shippingAddress[field]
                          : ""
                      }
                      onChange={(e) => handleAddressChange(e, field)}
                      className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${
                        isAddressSaved
                          ? "bg-gray-200 cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    />
                  </div>
                )
              )}
              <button
                disabled={isAddressSaved}
                onClick={handleSaveAddress}
                className={`bg-indigo-600 text-white py-2 px-4 rounded mt-2 ${
                  isAddressSaved
                    ? "bg-gray-400 cursor-not-allowed  opacity-50"
                    : ""
                }`}
              >
                Save Address
              </button>
            </div>
            {/* Order Summary Section */}
            {subTotalPrice > 0 && (
              <div className="w-full lg:w-1/2 lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  Order Summary
                </h2>
                <CartItems parent="PlaceOrder" />
                <div className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">Shipping Price</span>
                  <span className="ml-auto text-gray-900">
                    ${shippingPrice}
                  </span>
                </div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ${totalPrice}
                  </span>
                </div>
                {paypalClientId && (
                  <div className="mt-5">
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        disabled={!isAddressSaved}
                        createOrder={handlePayPalCreateOrder}
                        onApprove={(data, actions) =>
                          actions.order.capture().then(successPaymentHandler)
                        }
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layouts>
  );
}

export default PlaceOrder;
