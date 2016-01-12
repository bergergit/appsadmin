package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.bergermobile.persistence.domain.ApplicationUser;

@RepositoryRestResource
public interface ApplicationUserRepository extends CrudRepository<ApplicationUser, Integer> {

}
