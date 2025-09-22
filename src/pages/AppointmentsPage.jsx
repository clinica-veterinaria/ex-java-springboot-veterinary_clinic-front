import React, { useState } from "react";
import './AppointmentsPage.css';
import AppointmentsWidget from "../components/appointmentsWidget/AppointmentsWidget";
import SideMenuAdmin from '../components/sideMenuAdmin/SideMenuAdmin';
import AddAppt from '../components/addAppt/AddAppt';
import ButtonAdd from '../components/buttonAdd/ButtonAdd';
import AppointmentCard from "../components/appointmentCard/AppointmentCard";
import FeedbackModal from "../components/feedbackModal/FeedbackModal";
import Navbar from "../components/navbar/Navbar";
import { Filter } from "lucide-react";

export default function AppointmentsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const nextAppointments = [
        { id: 1, date: "23 SEP, 10:00h", patient: "Pepita", reason: "Vacuna", type: "estandar" },
        { id: 2, date: "23 SEP, 12:00h", patient: "Luna", reason: "Revisión", type: "urgente" }
    ];

    const handleOpenAdd = () =>  {
        console.log("Click detectado en +");
        setShowAddModal(true); }

    //Change to async await to get backend data
    const handleSaveAppointment = () => {
          setShowAddModal(false);
          setFeedback({ message: "Cita añadida con éxito ✅", type: "success" });
          };
          
      
    return(
        <div className="appointments-page">
            <aside>
                <SideMenuAdmin />
            </aside>
            <main className="appointments-page__main">
                <div className="appointments-page__navbar">
                    <Navbar/>
                </div>
                <div className="appointments-page__container">
                    <div className="appointments-page__title">
                        <h1>Citas</h1>
                    </div>
                    <div className="appointments-page__content">
                        <AppointmentsWidget />

                        <div className="appointments-page__next">
                            <h2 className="appointments-page__subtitle">Próximas citas</h2>
                                {nextAppointments.map(appt => (
                                <AppointmentCard
                                    key={appt.id}
                                    appointmentDatetime={appt.date}
                                    patient={appt.patient}
                                    reason={appt.reason}
                                    type={appt.type}
                                    isNextAppointment={true}
                                    onClick={() => console.log("Ver detalles")}/>
                                ))}
                        </div>

                        <div className="appointments-page__flying-button">
                            <ButtonAdd onClick={handleOpenAdd}/>
                        </div>
                    </div>
                    
                </div>
            </main>
            {showAddModal && (
            <AddAppt isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveAppointment} />
            )}

            {feedback && (
            <FeedbackModal message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)}/>
            )}
        </div>
    );

}