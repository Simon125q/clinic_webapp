package com.project.backend.controllers;

import com.project.backend.model.Appointment;
import com.project.backend.model.Doctor;
import com.project.backend.model.Patient;
import com.project.backend.repository.AppointmentRepository;
import com.project.backend.repository.DoctorRepository;
import com.project.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/appointments")
public class AppointmentRESTController {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public AppointmentRESTController(AppointmentRepository appointmentRepository,
                                     DoctorRepository doctorRepository,
                                     PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Appointment> findAllAppointments() { return appointmentRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Appointment findAppointment(@PathVariable("id") long id) {
        return appointmentRepository.findById(id);
    }

    @RequestMapping(value = "/d{id}", method = RequestMethod.GET)
    public Doctor findAppointmentsDoctor(@PathVariable("id") long id) {
        return this.appointmentRepository.findById(id).getDoctor();
//        for (Doctor doc : this.doctorRepository.findAll()) {
//            for (Appointment appointment : doc.getAppointmentList()) {
//                if (appointment.id)
//            }
//        }
    }

    @RequestMapping(value = "/p{id}", method = RequestMethod.GET)
    public Patient findAppointmentsPatient(@PathVariable("id") long id) {
        return this.appointmentRepository.findById(id).getPatient();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
        System.out.println(appointment);
        appointmentRepository.save(appointment);
        return new ResponseEntity<Appointment>(appointment, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<Appointment> deleteAllAppointments () {
        List<Appointment> appointments = appointmentRepository.findAll();
        if (appointments.isEmpty()) {
            System.out.println("Appointments not found!");
            return new ResponseEntity<Appointment>(HttpStatus.NOT_FOUND);
        }
        appointmentRepository.deleteAll();
        return new ResponseEntity<Appointment>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Appointment> deleteAppointment (@PathVariable("id") long id) {
        Appointment appointment = appointmentRepository.findById(id);
        if (appointment == null) {
            System.out.println("Appointment not found!");
            return new ResponseEntity<Appointment>(HttpStatus.NOT_FOUND);
        }
        appointmentRepository.deleteById(id);
        return new ResponseEntity<Appointment>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Appointment> updateAllAppointments(@RequestBody List<Appointment> appointments) {
        appointmentRepository.deleteAll();
        appointmentRepository.saveAll(appointments);
        return new ResponseEntity<Appointment>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Appointment> updateAppointment(@RequestBody Appointment appointment, @PathVariable("id") long id) {
        appointment.setId(id);
        appointmentRepository.save(appointment);
        return new ResponseEntity<Appointment>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<Appointment> updatePartOfAppointment(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Appointment appointment = appointmentRepository.findById(id);
        if (appointment == null) {
            System.out.println("Appointment not found!");
            return new ResponseEntity<Appointment>(HttpStatus.NOT_FOUND);
        }
        partialUpdate(appointment,updates);
        return new ResponseEntity<Appointment>(HttpStatus.OK);
    }

    private void partialUpdate(Appointment appointment, Map<String, Object> updates) {
        if (updates.containsKey("date")) {
            appointment.setDate((String) updates.get("date"));
        }
        if (updates.containsKey("time")) {
            appointment.setTime((String) updates.get("time"));
        }
        if (updates.containsKey("doctor_id")) {
            Doctor doctor = this.doctorRepository.findById((Integer) updates.get("doctor_id"));
            List<Appointment> doctorAppointments = doctor.getAppointmentList();
            doctorAppointments.add(appointment);
            doctor.setAppointmentList(doctorAppointments);
            doctorRepository.save(doctor);
            System.out.println(doctor);
            appointment.setDoctor(doctor);
        }
        if (updates.containsKey("patient_id")) {
            Patient patient = this.patientRepository.findById((Integer) updates.get("patient_id"));
            List<Appointment> patientAppointments = patient.getAppointmentList();
            patientAppointments.add(appointment);
            patient.setAppointmentList(patientAppointments);
            patientRepository.save(patient);
            System.out.println(patient);
            appointment.setPatient(patient);
        }

        appointmentRepository.save(appointment);
    }

}
