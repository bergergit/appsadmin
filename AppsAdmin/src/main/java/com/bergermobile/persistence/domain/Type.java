package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the type database table.
 * 
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Type implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String typeId;

	private String description;

	@Lob
	private String input;

	private String mimeType;

	private Boolean removable;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="type")
	private List<Field> fields;
}