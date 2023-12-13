import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import GetBillingDetails from "./childs/GetBillingDetails";
import PayWithStripe from "./childs/PayWithStripe";
import ShowConfirmedTicket from "./childs/ShowConfirmedTicket";

const MakePaymentContainer = () => {

    const { serviceId, serviceName, slotId } = useParams();
    const [initiatePaymentResponse, setInitiatePaymentResponse] = useState(null);
    const [paymentSuccessResponse, setPaymentSuccessResponse] = useState(null);

    const updatePaymentResponse = (res) => {
        console.log("updating payment response", res);
        setInitiatePaymentResponse(res);
    }

    const onPaymentSuccess = (paymentSuccessResponse) => {
        setPaymentSuccessResponse(paymentSuccessResponse);
    }

    let container;

    if (initiatePaymentResponse === null) {
        container =
            <GetBillingDetails
                serviceId={serviceId}
                serviceName={serviceName}
                slotId={slotId}
                onUpdateBillingDetails={updatePaymentResponse}
            />;
    } else if (paymentSuccessResponse === null) {
        container =
            <PayWithStripe
                initiatePaymentResponse={initiatePaymentResponse}
                onPaymentSuccess={onPaymentSuccess}
            />;
    } else {
        container =
            <ShowConfirmedTicket
                paymentSuccessResponse={paymentSuccessResponse}
                payment={initiatePaymentResponse}
            />;
    }

    return (
        <div>
            {container}
        </div>
    );
}

export default MakePaymentContainer;
