package com.bergermobile.persistence.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;

import lombok.Data;


/**
 * The persistent class for the type database table.
 * 
 */
@Entity
@Data
public class Type implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer typeId;

	private String description;

	@Lob
	private String input;

	private String mimeType;

	private byte removable;

	//bi-directional many-to-one association to Field
	@OneToMany(mappedBy="type")
	private List<Field> fields;
}