package com.bergermobile.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.bergermobile.persistence.domain.Content;

@RepositoryRestResource
@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN')")
public interface ContentRepository extends CrudRepository<Content, Integer> {
	
	public Integer deleteByGroupId(String groupId);

	public List<Content> findByGroupId(String groupId);

	public Integer deleteByContent(String content);

	public Content findByContent(String contentStr);
	
	@Query("update Content c set c.groupId = :groupId where c in (:contents)")
	@Modifying
	public Integer updateGroupId(@Param("contents") List<Content> contents, @Param("groupId") String groupId);
}
