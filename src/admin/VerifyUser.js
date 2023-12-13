import React, { useState } from 'react';
import { loadingIndicator } from "../common/loader/loading-indicator";
import { appNotification } from "../common/notification/app-notification";
import { config } from '../Constants'

import { QrReader } from 'react-qr-reader';
import { handleHttpErrors } from "../common/HttpHelper";

const VerifyUser = () => {
    const [state, setState] = useState({
        "showScanner": true,
        "payment": null
    });

    const handleResult = data => {
        console.log(data);
        if (data && data.indexOf("/") > 0) {
            const parts = data.split("/");
            const id = parts[parts.length - 1];
            displayTicketDetails(id);
        }
    };

    const handleError = err => {
        console.error(err)
    };

    const onReceiveData = (ticket) => {
        loadingIndicator.hide();
        const payment = ticket.payment;

        setState(prevState => ({
            ...prevState,
            payment: payment
        }));
    };

    const onError = (error) => {
        loadingIndicator.hide();
        appNotification.showError("Unable to retrieve User  - " + error);
        displayScanner();
    };

    const displayScanner = () => {
        setState(prevState => ({
            ...prevState,
            "showScanner": true,
            "payment": null
        }));
    };

    const hideScanner = () => {
        setState(prevState => ({
            ...prevState,
            "showScanner": false
        }));
    };

    const displayTicketDetails = (ticketId) => {
        loadingIndicator.show();
        hideScanner();

        const url = config.BOOKING_API_BASE_URL + '/tickets/' + ticketId;

        fetch(url)
            .then(res => handleHttpErrors(res))
            .then(res => res.json())
            .then((results) => onReceiveData(results))
            .catch(errorObject => onError(errorObject));
    };

    const { showScanner, payment } = state;

    if (showScanner) {
        return (
            <div>
                <QrReader
                    delay={300}
                    onError={handleError}
                    onResult={handleResult}
                    style={{ width: '100%' }}
                />
            </div>
        )
    } else if (null != payment) {
        const { email, phoneNumber, name, amount } = state.payment;
        const { stylistName, slotFor } = state.payment.slot;
        const serviceName = state.payment.slot.selectedService.name;
        const slotDate = new Date(slotFor).toDateString();

        return <>
            <h3>Details</h3>
            <div className="row">
                <div className="col-6">
                    <strong> Service Details</strong>
                    <div>{serviceName} @ {slotDate} By {stylistName}</div>
                    <hr />
                    <br />
                    <strong> User Information</strong>
                    <div>{name}</div>
                    <div>{email}</div>
                    <div>Zip {amount}</div>
                    <div>Phone {phoneNumber}</div>
                </div>
                <div className="col-6">
                    <button type="button" className="btn btn-primary" onClick={displayScanner}>Scan another</button>
                </div>
            </div>
        </>
    }

    return <></>;
};

export default VerifyUser;
