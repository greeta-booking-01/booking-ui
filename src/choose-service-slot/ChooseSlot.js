import React, { useState, useEffect } from 'react';
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import { loadingIndicator } from "../common/loader/loading-indicator";
import { appNotification } from "../common/notification/app-notification";
import { config } from '../Constants'
import { getFormattedTime, getTomorrow, isDateGreaterThanToday, isDateLesserThanToday } from "../common/DateHelper";
import { handleHttpErrors } from "../common/HttpHelper";

/* Choose Slot Component*/
const ChooseSlot = (props) => {
    const navigate = useNavigate();
    const { serviceId: routerServiceId, serviceName: routerServiceName } = useParams();
    const [serviceId, setServiceId] = useState(routerServiceId);
    const [serviceName, setServiceName] = useState(routerServiceName);
    const [slotDate, setSlotDate] = useState(getTomorrow());
    const [slots, setSlots] = useState([]);

    const setDate = (val) => {
        setSlotDate(val);
    }

    const filterAndFormat = (items) => {
        return items.filter(item => isDateGreaterThanToday(item.slotFor))
            .map(item => {
                item.time = getFormattedTime(item.slotFor);
                return item;
            });
    }

    const onReceiveData = (items) => {
        loadingIndicator.hide();
        const newSlots = filterAndFormat(items);
        if (newSlots.length === 0) {
            appNotification.showError("No Slots available");
            return;
        }
        setSlots(newSlots);
    }

    const onError = (error) => {
        loadingIndicator.hide();
        appNotification.showError("Unable to retrieve Slots  - " + error);
    }

    const showSlotsOnDate = () => {
        if (isDateLesserThanToday(slotDate)) {
            appNotification.showError("Selected date cannot be booked");
            return;
        }
        setSlots([]);
        loadingIndicator.show();
        const url = config.BOOKING_API_BASE_URL + '/slots/retrieveAvailableSlots/' + serviceId + '/' + slotDate;
        fetch(url)
            .then(res => handleHttpErrors(res))
            .then(res => res.json())
            .then((results) => onReceiveData(results))
            .catch(errorObject => onError(errorObject));
    }

    const bookSlotFor = (item) => (
        navigate("/makepayment/" + item.id + "/" + serviceId + "/" + serviceName)
    );

    return (
        <div>
            <div className="row">
                <div className="col-4"><strong>Choose a Date for {serviceName}</strong></div>
                <div className="col-5">
                    <input
                        className="form-control form-control-lg"
                        type="date"
                        value={slotDate}
                        onChange={(evt) => setDate(evt.target.value)}
                    />
                </div>
                <div className="col-3">
                    <button
                        type="submit"
                        className="btn btn-primary mb-2"
                        onClick={showSlotsOnDate}
                    >
                        Show Slots
                    </button>
                </div>
            </div>
            {slots.length > 0 && <h4 className="pt-5">Available Slots on {slotDate} <br /> </h4>}
            <div className="grid-container row  text-center">
                {slots.map((item, index) => (
                    <div key={index} className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">{serviceName}</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">{item.stylistName} </h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>Slot Time {item.time}</li>
                            </ul>
                            <button
                                type="button"
                                onClick={() => bookSlotFor(item)}
                                className="btn btn-lg btn-block btn-outline-primary"
                            >
                                Book this Slot
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChooseSlot;
