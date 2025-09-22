import React from "react";
import { useForm } from "react-hook-form";
import "./AddAppointment.css";
import Button from "../buttons/Button";
import InputField from "../inputField/InputField";

export default function AddAppointment({ onCancel, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onSave?.(data);
  };

  return (
    <div className="add-appointment">
      <div className="add-appointment__content">
        <div className="add-appointment__title">
          <h2>Añadir cita</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-appointment__form">
          <div className="add-appointment__fields">
            <div className="add-appointment__row">
              <InputField
                label="Nombre mascota"
                placeholder="Ej.: Valentín"
                {...register("petName", {
                  required: "El nombre de la mascota es obligatorio",
                })}
                error={errors.petName?.message}
              />

              <InputField
                label="ID"
                placeholder="Ej.: 15032"
                {...register("id", { required: "El ID es obligatorio" })}
                error={errors.id?.message}
              />
            </div>

            <div className="add-appointment__row">
              <InputField
                label="Fecha"
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                error={errors.date?.message}
              />

              <InputField
                label="Hora"
                type="time"
                {...register("time", { required: "La hora es obligatoria" })}
                error={errors.time?.message}
              />
            </div>

            <InputField
              label="Motivo"
              placeholder="Ej.: Revisión del año"
              type="textarea"
              {...register("reason", { required: "El motivo es obligatorio" })}
              error={errors.reason?.message}
            />

            <div className="add-appointment__row">
              <label htmlFor="type">Tipo</label>
              <select id="type" {...register("type")}>
                <option value="estandar">Estándar</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="add-appointment__buttons">
            <Button variant="secondary" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
