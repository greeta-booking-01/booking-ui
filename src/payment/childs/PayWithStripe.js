import React, { useState } from 'react';
import { loadingIndicator } from "../../common/loader/loading-indicator";
import { appNotification } from "../../common/notification/app-notification";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

const PayWithStripe = ({ initiatePaymentResponse, onPaymentSuccess }) => {
    const [processingPayment, setProcessingPayment] = useState(false);

    const handleSubmit = async (event, stripe, elements) => {
        event.preventDefault();
        event.stopPropagation();

        loadingIndicator.show();
        setProcessingPayment(true);
        const { clientSecret, firstName, lastName, email, phoneNumber } = initiatePaymentResponse;

        const name = firstName + " " + lastName;

        const data = {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: name,
                    email: email,
                    phone: phoneNumber,
                },
            },
        };
        const result = await stripe.confirmCardPayment(clientSecret, data);

        if (result.error) {
            console.log(result.error);
            appNotification.showError(result.error.message);
            setProcessingPayment(false);
            loadingIndicator.hide();
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                console.log(result.paymentIntent);
                setProcessingPayment(false);
                loadingIndicator.hide();
                onPaymentSuccess(result.paymentIntent);
            }
        }
    };

    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <form onSubmit={(evt) => handleSubmit(evt, stripe, elements)}>
                    <div>
                        <h3>Enter Card details</h3>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>

                    <div className="pt-5"><small>Test Card 4242424242424242</small></div>

                    <button type="submit" className="btn btn-success mt-4" disabled={!stripe || processingPayment}>Pay</button>
                    <br />
                </form>
            )}
        </ElementsConsumer>
    );
};

export default PayWithStripe;
