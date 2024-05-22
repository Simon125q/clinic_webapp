package com.project.backend.controllers;

import com.project.backend.model.Appointment;
import com.project.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentRESTController {
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentRESTController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Appointment> findAllAppointments() { return appointmentRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Appointment findAppointment(@PathVariable("id") long id) {
        return appointmentRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment appointment) {
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
        return new ResponseEntity<Appointment>(HttpStatus.NO_CONTENT);
    }

    private void partialUpdate(Appointment appointment, Map<String, Object> updates) {
        if (updates.containsKey("date")) {
            appointment.setDate((String) updates.get("date"));
        }
        if (updates.containsKey("time")) {
            appointment.setTime((String) updates.get("time"));
        }

        appointmentRepository.save(appointment);
    }

}
