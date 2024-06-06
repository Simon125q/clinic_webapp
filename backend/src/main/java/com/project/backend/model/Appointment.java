package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue
    private long id;
    private String date;
    private String time;

//    @JsonBackReference(value = "doctor-appointment")
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "doctor_id")
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    @JsonBackReference(value = "doctor-appointment")
    private Doctor doctor;

//    @JsonBackReference(value = "patient-appointment")
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "patient_id")
    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonBackReference(value = "patient-appointment")
    private Patient patient;

//    @OneToOne(cascade = CascadeType.ALL)
    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "appointment-prescription")
    private Prescription prescription;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id='" + id + '\'' +
                ", date='" + date + '\'' +
                ", time='" + time + '\'' +
                ", doctor='" + doctor + '\'' +
                ", patient='" + patient + '\'' +
                '}';
    }
}
