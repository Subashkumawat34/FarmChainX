package com.farmchainX.farmchainX.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmchainX.farmchainX.model.User;


public interface UserRepository extends JpaRepository<User, Long>{
	
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name); 
	Boolean existsByEmail(String email);

}