import React from 'react';
import './SignInPage.css';
import Oliwa from '../assets/logoPositive.svg'
import { PawPrint } from 'lucide-react';
import SignInModal from '../components/signInModal/SignInModal';


export default function SignInPage() {
    return (
        <div className="login-page">
            <div className="login-background">
                {/* background */}
                {Array.from({ length: 200 }).map((_, i) => (
                    <PawPrint key={i} size={60} color='#D9E460' strokeWidth={1} />
                ))}
            </div>
            <div className="login-content">
                <div className="logo-container">
                    <img src={Oliwa} alt="Olivwa Logo" width="500" height="120" />
                </div>
                <div className="sign-in__modal-container">
                <SignInModal></SignInModal>
                </div>
            </div>
        </div>
    );
}    