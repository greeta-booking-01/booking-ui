import React, { useState, useEffect } from 'react';
import { loadingIndicator } from "../../common/loader/loading-indicator";
import { appNotification } from "../../common/notification/app-notification";
import { config } from '../../Constants'
import { handleHttpErrors } from "../../common/HttpHelper";
import QRCode from 'qrcode.react';
import { getKeycloak } from '../../misc/Helpers'

const ShowConfirmedTicket = ({ paymentSuccessResponse, payment }) => {
    const [ticketState, setTicketState] = useState({
        "paymentSuccessResponse": paymentSuccessResponse,
        "payment": payment,
        "processing": true,
        "ticketUrl": "",
        "ticketId": "",
        "salonDetails": null,
        "slot": null,
    });

    const { processing, ticketUrl, salonDetails, slot } = ticketState;

    useEffect(() => {
        generateTicket();
    }, []);

    const onReceiveData = (ticketResponse) => {
        console.log("Ticket response", ticketResponse);
        loadingIndicator.hide();

        const ticketUrl = config.BOOKING_API_BASE_URL + "/tickets/" + ticketResponse.ticket.id;
        setTicketState(prevState => ({
            ...prevState,
            "processing": false,
            "ticketUrl": ticketUrl,
            salonDetails: ticketResponse.salonDetails,
            slot: ticketResponse.ticket.payment.slot
        }));
    };

    const onError = (error) => {
        loadingIndicator.hide();
        appNotification.showError("Unable to Generate Ticket  - " + error);
    };

    const generateTicket = () => {
        console.log(ticketState);

        const { id } = ticketState.payment;

        const  keycloak = getKeycloak();

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keycloak.token}` }
        };

        const url = config.BOOKING_API_BASE_URL + '/payments/confirm/' + id;

        fetch(url, requestOptions)
            .then(res => handleHttpErrors(res))
            .then(res => res.json())
            .then((results) => onReceiveData(results))
            .catch(errorObject => onError(errorObject));
    };

    if (processing) {
        return (
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Generating Ticket...</span>
            </button>
        );
    }

    const { name, address, city, salonState, zipcode, phone } = salonDetails;
    const { stylistName, slotFor } = slot;
    const serviceName = slot.selectedService.name;
    const slotDate = new Date(slotFor).toDateString();

    return (
        <>
            <h3>Your Ticket Details</h3>
            <div className="row">
                <div className="col-6">
                    <strong> Service Details</strong>
                    <div>{serviceName} @ {slotDate} By {stylistName} </div>
                    <hr />
                    <br />
                    <strong> Salon Address Details</strong>
                    <div>{name}</div>
                    <div>{address}</div>
                    <div>{city}</div>
                    <div>{salonState}</div>
                    <div>Zip {zipcode}</div>
                    <div>Phone {phone}</div>

                </div>
                <div className="col-6">

                    <strong>Take a Picture of the below code and present it to admin </strong>
                    <QRCode value={ticketUrl} />
                </div>

            </div>

        </>
    );
};

export default ShowConfirmedTicket;
