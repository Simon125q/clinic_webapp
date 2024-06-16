package com.project.backend.controllers;

import com.project.backend.model.Appointment;
import com.project.backend.model.Prescription;
import com.project.backend.repository.AppointmentRepository;
import com.project.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/prescriptions")
public class PrescriptionRESTController {
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public PrescriptionRESTController(PrescriptionRepository prescriptionRepository,
                                      AppointmentRepository appointmentRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Prescription> findAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Prescription findPrescription(@PathVariable("id") long id) {
        return prescriptionRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Prescription> addPrescription(@RequestBody Prescription prescription) {
        System.out.println(prescription.getId() + " " + prescription.getRecommendation() + " " + prescription.getAppointment());
        prescriptionRepository.save(prescription);
        Appointment temp = appointmentRepository.findById(prescription.getAppointment().getId());
        temp.setPrescription(prescription);
        appointmentRepository.save(temp);
        return new ResponseEntity<Prescription>(prescription, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.DELETE)

    public ResponseEntity<Prescription> deleteAllPrescriptions () {
        System.out.println("deleting prescriptions");
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        if (prescriptions.isEmpty()) {
            System.out.println("Prescriptions not found!");
            return new ResponseEntity<Prescription>(HttpStatus.NOT_FOUND);
        }
        prescriptionRepository.deleteAll();
        return new ResponseEntity<Prescription>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Prescription> deletePrescription (@PathVariable("id") long id) {
        Prescription prescription = prescriptionRepository.findById(id);
        if (prescription == null) {
            System.out.println("Prescription not found!");
            return new ResponseEntity<Prescription>(HttpStatus.NOT_FOUND);
        }
        prescriptionRepository.deleteById(id);
        return new ResponseEntity<Prescription>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Prescription> updateAllPrescriptions(@RequestBody List<Prescription> prescriptions) {
        prescriptionRepository.deleteAll();
        prescriptionRepository.saveAll(prescriptions);
        return new ResponseEntity<Prescription>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Prescription> updatePrescription(@RequestBody Prescription prescription, @PathVariable("id") long id) {
        prescription.setId(id);
        prescriptionRepository.save(prescription);
        return new ResponseEntity<Prescription>(prescription, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<Prescription> updatePartOfPrescription(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Prescription prescription = prescriptionRepository.findById(id);
        if (prescription == null) {
            System.out.println("Prescription not found!");
            return new ResponseEntity<Prescription>(HttpStatus.NOT_FOUND);
        }
        Prescription newPrescription = partialUpdate(prescription,updates);
        return new ResponseEntity<Prescription>(newPrescription, HttpStatus.OK);
    }

    private Prescription partialUpdate(Prescription prescription, Map<String, Object> updates) {
        if (updates.containsKey("recommendation")) {
            prescription.setRecommendation((String) updates.get("recommendation"));
        }
        prescriptionRepository.save(prescription);
        return prescription;
    }

}
