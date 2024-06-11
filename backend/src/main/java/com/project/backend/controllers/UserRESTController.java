package com.project.backend.controllers;

import com.project.backend.model.Appointment;
import com.project.backend.model.User;
import com.project.backend.repository.AppointmentRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/users")
public class UserRESTController {
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public UserRESTController(UserRepository userRepository,
                                AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public User findUser(@PathVariable("id") long id) {
        return userRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<User> addUser(@RequestBody User user) {
        userRepository.save(user);
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.DELETE)

    public ResponseEntity<User> deleteAllUsers () {
        System.out.println("deleting users");
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            System.out.println("Users not found!");
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        userRepository.deleteAll();
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteUser (@PathVariable("id") long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            System.out.println("User not found!");
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<User> updateAllUsers(@RequestBody List<User> users) {
        userRepository.deleteAll();
        userRepository.saveAll(users);
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable("id") long id) {
        user.setId(id);
        userRepository.save(user);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<User> updatePartOfUser(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            System.out.println("User not found!");
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        User newUser = partialUpdate(user,updates);
        return new ResponseEntity<User>(newUser, HttpStatus.OK);
    }

    private User partialUpdate(User user, Map<String, Object> updates) {
        if (updates.containsKey("firstname")) {
            user.setUsername((String) updates.get("username"));
        }
        if (updates.containsKey("lastname")) {
            user.setPassword((String) updates.get("password"));
        }

        userRepository.save(user);
        return user;
    }
}
