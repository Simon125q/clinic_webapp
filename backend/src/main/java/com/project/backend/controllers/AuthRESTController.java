package com.project.backend.controllers;

import com.project.backend.message.request.LoginForm;
import com.project.backend.message.request.SignUpForm;
import com.project.backend.message.response.JwtResponse;
import com.project.backend.message.response.ResponseMessage;
import com.project.backend.model.Patient;
import com.project.backend.model.Role;
import com.project.backend.model.RoleName;
import com.project.backend.model.User;
import com.project.backend.repository.PatientRepository;
import com.project.backend.repository.RoleRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.security.jwt.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RequestMapping("/auth")
public class AuthRESTController {

    private DaoAuthenticationProvider daoAuthenticationProvider;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtProvider jwtProvider;
    private PatientRepository patientRepository;

    @Autowired
    public AuthRESTController(DaoAuthenticationProvider daoAuthenticationProvider, UserRepository userRepository,
                              RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                              JwtProvider jwtProvider, PatientRepository patientRepository) {
        this.daoAuthenticationProvider = daoAuthenticationProvider;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {
        Authentication authentication = daoAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateJwtToken(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        System.out.println("signing in with token " + jwt);
        return ResponseEntity.ok(new JwtResponse(jwt,userDetails.getUsername(), userDetails.getAuthorities()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpForm signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity<>(new ResponseMessage("Fail -> Username is already taken."), HttpStatus.BAD_REQUEST);
        }

        // Create user account
        User user = new User(signUpRequest.getUsername(), passwordEncoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
            switch (role) {
                case "admin":
                    Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Fail -> Cause: Admin Role not found."));
                    roles.add(adminRole);
                    break;
                case "doctor":
                    Role doctorRole = roleRepository.findByName(RoleName.ROLE_DOCTOR)
                            .orElseThrow(() -> new RuntimeException("Fail -> Cause: Doctor Role not found."));
                    roles.add(doctorRole);
                    break;
                default:
                    Role userRole = roleRepository.findByName(RoleName.ROLE_PATIENT)
                            .orElseThrow(() -> new RuntimeException("Fail -> Cause: Patient Role not found."));
                    roles.add(userRole);
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return new ResponseEntity<>(new ResponseMessage("User registered successfully."), HttpStatus.OK);

    }

    @PatchMapping("/{username}")
    public ResponseEntity<User> updatePartOfPatient(@RequestBody Map<String, Object> updates, @PathVariable("username") String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            System.out.println("User not found!");
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        User newUser = partialUpdate(user.get(),updates);
        return new ResponseEntity<User>(newUser, HttpStatus.OK);
    }

    private User partialUpdate(User user, Map<String, Object> updates) {
        if (updates.containsKey("username")) {
            user.setUsername((String) updates.get("firstname"));
        }
        if (updates.containsKey("password")) {
            user.setPassword((String) updates.get("lastname"));
        }
        if (updates.containsKey("role")) {
            List<String> strRoles = (List<String>) updates.get("role");
            Set<Role> roles = new HashSet<>();

            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Fail -> Cause: Admin Role not found."));
                        roles.add(adminRole);
                        break;
                    case "doctor":
                        Role doctorRole = roleRepository.findByName(RoleName.ROLE_DOCTOR)
                                .orElseThrow(() -> new RuntimeException("Fail -> Cause: Doctor Role not found."));
                        roles.add(doctorRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleName.ROLE_PATIENT)
                                .orElseThrow(() -> new RuntimeException("Fail -> Cause: Patient Role not found."));
                        roles.add(userRole);
                }
            });
            user.setRoles(roles);
        }
        this.userRepository.save(user);
        return user;
    }

    @PostMapping("/signup/patient")
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        patientRepository.save(patient);
        return new ResponseEntity<Patient>(patient, HttpStatus.CREATED);
    }

}
