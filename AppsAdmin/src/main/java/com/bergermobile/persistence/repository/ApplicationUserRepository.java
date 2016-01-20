package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.ApplicationUser;

@RepositoryRestResource(collectionResourceRel="applicationUsers", path="applicationUsers")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface ApplicationUserRepository extends CrudRepository<ApplicationUser, Integer> {
	
}
