import React from "react";
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
      const navigate = useNavigate()
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold">404</h1>
                    <p className="py-6 text-xl">
                        Oops! The Page you requested was not found!
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Back To Home</button>
                </div>
            </div>
        </div>
    )
}
export default PageNotFound;