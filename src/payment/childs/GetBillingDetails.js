import React, { useState } from 'react';
import { loadingIndicator } from "../../common/loader/loading-indicator";
import { appNotification } from "../../common/notification/app-notification";
import { config } from '../../Constants'
import { handleHttpErrors } from "../../common/HttpHelper";
import { getKeycloak } from '../../misc/Helpers'

const GetBillingDetails = ({ serviceId, serviceName, slotId, onUpdateBillingDetails }) => {

    const [billingDetails, setBillingDetails] = useState({
        "serviceId": serviceId,
        "serviceName": serviceName,
        "slotId": slotId,
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "wasValidated": "",
    });

    const onReceiveData = (paymentResponse) => {
        console.log(paymentResponse);
        loadingIndicator.hide();
        onUpdateBillingDetails(paymentResponse);
    };

    const onError = (error) => {
        loadingIndicator.hide();
        appNotification.showError("Unable to initiate payment  - " + error);
    };

    const initiatePayment = (evt) => {
        const form = evt.currentTarget;

        if (form.checkValidity() === false) {
            return false;
        }

        evt.preventDefault();
        evt.stopPropagation();

        loadingIndicator.show();

        const paymentRequest = {
            "selectedSalonServiceDetailId": billingDetails.serviceId,
            "slotId": billingDetails.slotId,
            "firstName": billingDetails.firstName,
            "lastName": billingDetails.lastName,
            "email": billingDetails.email,
            "phoneNumber": billingDetails.phoneNumber,
        };

        const  keycloak = getKeycloak();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keycloak.token}` },
            body: JSON.stringify(paymentRequest),
        };

        const url = config.BOOKING_API_BASE_URL + '/payments/initiate';

        fetch(url, requestOptions)
            .then(res => handleHttpErrors(res))
            .then(res => res.json())
            .then(results => onReceiveData(results))
            .catch(errorObject => onError(errorObject));

        return false;
    };

    const updateState = (key, value) => {
        setBillingDetails(prevState => ({
            ...prevState,
            [key]: value,
            "wasValidated": "was-validated",
        }));
    };

    return (
        <div className="row">
            <div className="col-12 pl-0">
                <h3>Enter Billing Details</h3>

                <form className={billingDetails.wasValidated} onSubmit={initiatePayment}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" required value={billingDetails.firstName}
                            onChange={evt => updateState("firstName", evt.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" required value={billingDetails.lastName}
                            onChange={evt => updateState("lastName", evt.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" required value={billingDetails.email}
                            onChange={evt => updateState("email", evt.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" className="form-control" required value={billingDetails.phoneNumber}
                            onChange={evt => updateState("phoneNumber", evt.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" >Make Payment</button>
                </form>

            </div>
        </div>
    );
};

export default GetBillingDetails;
