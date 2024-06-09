package com.project.backend.repository;

import com.project.backend.model.Doctor;
import com.project.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Prescription findById(long id);
}

