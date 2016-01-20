package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Menu;

@RepositoryRestResource
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface MenuRepository extends CrudRepository<Menu, Integer> {

}
