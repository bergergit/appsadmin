package com.bergermobile.persistence.domain;

import java.io.Serializable;

import javax.persistence.*;

import java.util.Date;

import lombok.Getter;


/**
 * The persistent class for the content database table.
 * 
 */
@Entity
@Getter
public class Content implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer contentId;

	@Lob
	private String content;

	private String groupId;

	private String locale;

	private String updatedBy;

	@Temporal(TemporalType.TIMESTAMP)
	private Date updatedDate;

	//bi-directional many-to-one association to Field
	@ManyToOne
	private Field field;
}