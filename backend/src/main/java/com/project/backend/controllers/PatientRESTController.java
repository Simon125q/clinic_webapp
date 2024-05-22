package com.project.backend.controllers;

import com.project.backend.model.Patient;
import com.project.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/patients")
public class PatientRESTController {
    private final PatientRepository patientRepository;

    @Autowired
    public PatientRESTController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Patient> findAllPatients() {
        return patientRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Patient findPatient(@PathVariable("id") long id) {
        return patientRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        patientRepository.save(patient);
        return new ResponseEntity<Patient>(patient, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.DELETE)

    public ResponseEntity<Patient> deleteAllPatients () {
        System.out.println("deleting patients");
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty()) {
            System.out.println("Patients not found!");
            return new ResponseEntity<Patient>(HttpStatus.NOT_FOUND);
        }
        patientRepository.deleteAll();
        return new ResponseEntity<Patient>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Patient> deletePatient (@PathVariable("id") long id) {
        Patient patient = patientRepository.findById(id);
        if (patient == null) {
            System.out.println("Patient not found!");
            return new ResponseEntity<Patient>(HttpStatus.NOT_FOUND);
        }
        patientRepository.deleteById(id);
        return new ResponseEntity<Patient>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Patient> updateAllPatients(@RequestBody List<Patient> patients) {
        patientRepository.deleteAll();
        patientRepository.saveAll(patients);
        return new ResponseEntity<Patient>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient, @PathVariable("id") long id) {
        patient.setId(id);
        patientRepository.save(patient);
        return new ResponseEntity<Patient>(patient, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<Patient> updatePartOfPatient(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Patient patient = patientRepository.findById(id);
        if (patient == null) {
            System.out.println("Patient not found!");
            return new ResponseEntity<Patient>(HttpStatus.NOT_FOUND);
        }
        Patient newPatient = partialUpdate(patient,updates);
        return new ResponseEntity<Patient>(newPatient, HttpStatus.OK);
    }

    private Patient partialUpdate(Patient patient, Map<String, Object> updates) {
        if (updates.containsKey("firstname")) {
            patient.setFirstName((String) updates.get("firstname"));
        }
        if (updates.containsKey("lastname")) {
            patient.setLastName((String) updates.get("lastname"));
        }
        if (updates.containsKey("email")) {
            patient.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("telephone")) {
            patient.setTelephone((String) updates.get("telephone"));
        }
        patientRepository.save(patient);
        return patient;
    }
}
