import React, { useState, useEffect } from 'react';
import { Alert } from "react-bootstrap";
import { appNotification } from "./app-notification";

const TEN_SECONDS = 10 * 1000

/* App Notification Component */
const AppNotificationComponent = () => {
    const [notification, setNotification] = useState({
        show: false,
        title: '',
        variant: '',
        message: '',
    });

    useEffect(() => {
        const subscription = appNotification.onChange().subscribe(res => {
            console.log("notification received");
            setNotification({
                show: true,
                title: res.title,
                variant: res.variant,
                message: res.message,
            });

            setTimeout(() => {
                setNotification({
                    show: false,
                    title: '',
                    variant: '',
                    message: '',
                });
            }, TEN_SECONDS);
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);

    const reset = () => {
        setNotification({
            show: false,
            title: '',
            variant: '',
            message: '',
        });
    }

    const { show, title, message, variant } = notification;

    return (
        <>
            {show && (
                <div className="message-container">
                    <div className="container">
                        <Alert variant={variant} onClose={reset} dismissible>
                            <Alert.Heading>{title}</Alert.Heading>
                            <p>{message}</p>
                        </Alert>
                    </div>
                </div>
            )}
        </>
    )
}


export default AppNotificationComponent;
