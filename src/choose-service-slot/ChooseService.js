import React, { useState, useEffect } from 'react';
import { config } from '../Constants'
import { loadingIndicator } from "../common/loader/loading-indicator";
import { appNotification } from "../common/notification/app-notification";
import { useNavigate } from 'react-router-dom';

/* Choose Service Component */
const ChooseService = (props) => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        downloadServices();
    }, []);

    const onReceiveData = (items) => {
        loadingIndicator.hide();
        setItems(items);
    }

    const onError = (error) => {
        loadingIndicator.hide();
        appNotification.showError("Unable to retrieve Spa Services  - " + error);
    }

    const downloadServices = () => {
        loadingIndicator.show();

        const url = config.BOOKING_API_BASE_URL + '/services/retrieveAvailableSalonServices';

        fetch(url)
            .then(res => handleErrors(res))
            .then(res => res.json())
            .then((results) => onReceiveData(results))
            .catch(errorObject => onError(errorObject));
    }

    const handleErrors = (response) => {
        return new Promise((resolve, reject) => {
            if (!response.ok) {
                getErrorText(response).then(res => {
                    reject(res);
                });
            } else {
                resolve(response);
            }
        });
    }

    const getErrorText = async (response) => {
        let result = null;
        try {
            result = await response.json();
        } catch (e) { }

        if (result && result["message"]) {
            return result["message"];
        }

        return JSON.stringify(result);;
    };

    const bookFor = (item) => {
        navigate("/chooseslot/" + item.id + "/" + item.name);
    }

    return (
        <>
            <div className="grid-container row  text-center">
                {items.map((item, index) => (
                    <div key={index} className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h4 className="my-0 font-weight-normal">{item.name}</h4>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">${item.price} </h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>{item.description}</li>
                                <li>{item.timeInMinutes} Minutes</li>
                            </ul>
                            <button type="button" onClick={() => bookFor(item)} className="btn btn-lg btn-block btn-outline-primary">Book Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ChooseService;
