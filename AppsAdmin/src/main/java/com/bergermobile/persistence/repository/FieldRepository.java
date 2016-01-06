package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.bergermobile.persistence.domain.Field;

@RepositoryRestResource
public interface FieldRepository extends CrudRepository<Field, Integer> {

}
