package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Content;

@RepositoryRestResource
@PreAuthorize("hasRole('ROLE_USER')")
public interface ContentRepository extends CrudRepository<Content, Integer> {

}
