package com.bergermobile.persistence.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.bergermobile.persistence.domain.Type;

@RepositoryRestResource
public interface TypeRepository extends CrudRepository<Type, Integer> {

}
