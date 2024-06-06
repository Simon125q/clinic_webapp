package com.project.backend.controllers;

import com.project.backend.model.Appointment;
import com.project.backend.model.Doctor;
import com.project.backend.repository.AppointmentRepository;
import com.project.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/doctors")
public class DoctorRESTController {
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public DoctorRESTController(DoctorRepository doctorRepository,
                                AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Doctor> findAllDoctors() {
        return doctorRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Doctor findDoctor(@PathVariable("id") long id) {
        return doctorRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        doctorRepository.save(doctor);
        return new ResponseEntity<Doctor>(doctor, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.DELETE)

    public ResponseEntity<Doctor> deleteAllDoctors () {
        System.out.println("deleting doctors");
        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            System.out.println("Doctors not found!");
            return new ResponseEntity<Doctor>(HttpStatus.NOT_FOUND);
        }
        for (Doctor doctor : doctors) {
            for (Appointment appointment : doctor.getAppointmentList()) {
                this.appointmentRepository.deleteById(appointment.getId());
            }
        }
        doctorRepository.deleteAll();
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Doctor> deleteDoctor (@PathVariable("id") long id) {
        Doctor doctor = doctorRepository.findById(id);
        if (doctor == null) {
            System.out.println("Doctor not found!");
            return new ResponseEntity<Doctor>(HttpStatus.NOT_FOUND);
        }
        for (Appointment appointment : doctor.getAppointmentList()) {
            this.appointmentRepository.deleteById(appointment.getId());
        }
        doctorRepository.deleteById(id);
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Doctor> updateAllDoctors(@RequestBody List<Doctor> doctors) {
        doctorRepository.deleteAll();
        doctorRepository.saveAll(doctors);
        return new ResponseEntity<Doctor>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Doctor> updateDoctor(@RequestBody Doctor doctor, @PathVariable("id") long id) {
        doctor.setId(id);
        doctorRepository.save(doctor);
        return new ResponseEntity<Doctor>(doctor, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<Doctor> updatePartOfDoctor(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Doctor doctor = doctorRepository.findById(id);
        if (doctor == null) {
            System.out.println("Doctor not found!");
            return new ResponseEntity<Doctor>(HttpStatus.NOT_FOUND);
        }
        Doctor newDoctor = partialUpdate(doctor,updates);
        return new ResponseEntity<Doctor>(newDoctor, HttpStatus.OK);
    }

    private Doctor partialUpdate(Doctor doctor, Map<String, Object> updates) {
        if (updates.containsKey("firstname")) {
            doctor.setFirstName((String) updates.get("firstname"));
        }
        if (updates.containsKey("lastname")) {
            doctor.setLastName((String) updates.get("lastname"));
        }
        if (updates.containsKey("email")) {
            doctor.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("telephone")) {
            doctor.setTelephone((String) updates.get("telephone"));
        }
        if (updates.containsKey("specialization")) {
            doctor.setSpecialization((String) updates.get("specialization"));
        }
        if (updates.containsKey("description")) {
            doctor.setDescription((String) updates.get("description"));
        }
        doctorRepository.save(doctor);
        return doctor;
    }
}
