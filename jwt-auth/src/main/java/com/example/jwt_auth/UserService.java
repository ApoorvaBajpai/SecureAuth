package com.example.jwt_auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User validateUser(String id, String password) {
        return userRepository.findById(id)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    // ⭐ NEW METHOD — Pagination
    public Page<User> getUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("id").ascending()));
    }
}
