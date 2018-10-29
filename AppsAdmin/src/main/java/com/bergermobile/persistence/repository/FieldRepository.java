package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Field;

@RepositoryRestResource
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface FieldRepository extends CrudRepository<Field, Integer> {
	
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
	Field findOne(Integer id);

}
