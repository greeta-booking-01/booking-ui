import React, { useState, useEffect } from 'react';
import { loadingIndicator } from './loading-indicator';
import { ProgressBar } from "react-bootstrap";

/* Loading Indicator Component */
const LoadingIndicatorComponent = () => {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const subscription = loadingIndicator.onChange().subscribe(value => {
            setShowLoading(value);
        });

        // Unsubscribe on component unmount
        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            {showLoading && <div className="progress-container"><ProgressBar animated now={100} /></div>}
        </>
    );
}

export default LoadingIndicatorComponent;
