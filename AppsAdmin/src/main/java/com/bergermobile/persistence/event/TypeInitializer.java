package com.bergermobile.persistence.event;


import java.util.Arrays;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bergermobile.persistence.domain.Type;
import com.bergermobile.persistence.repository.TypeRepository;

/**
 * Initializer to set up the {@link Type}s.
 */
@Service
class TypeInitializer {

	/**
	 * Creates the default types persists them using the given {@link TypeRepsitory}.
	 * 
	 * @param types must not be {@literal null}.
	 */
	@Autowired
	public TypeInitializer(TypeRepository typeRepository) {

		// we need to create an 'admin' security context to be able to invoke the Type repository
		Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_ADMIN");
        Authentication authentication = new UsernamePasswordAuthenticationToken("user", "password", authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

		if (typeRepository.count() != 0) {
			return;
		} 
		
		Type string = new Type("String", "text/html", "Textos pequenos como titulos. Sera visualizado como text box.", "<input type=\"text\" class=\"text ui-widget-content ui-corner-all\"/>", false, null);
		Type bigString = new Type("BigString", "text/html", "Textos grandes como descrições. Será visualizado como TextArea.", "<textarea class=\"ui-widget ui-widget-content ui-corner-all\"></textarea>", false, null);
		Type image = new Type("Image", "image/jpeg", "Fotos e imagens", "<input type=\"file\" class=\"text ui-widget-content ui-corner-all\"/>", false, null);
		Type audio = new Type("Audio", "audio/mpeg", "Músicas MP3", null, false, null);
		Type date = new Type("Date", "text/html", "Data", "<input type=\"text\" maxlength=\"10\" class=\"date ui-widget-content ui-corner-all input-datepicker\"/>", false, null);
		Type publishedDate = new Type("PublishedDate", "text/html", "Data. Conteúdos com data inferior ao dia de hoje não serão mostrados para o usuário.", "<input type=\"text\" maxlength=\"10\" class=\"date ui-widget-content ui-corner-all input-datepicker\"/>", false, null);
		Type video = new Type("Video", "video/mpeg", "Vídeos", "<input type=\"file\" class=\"text ui-widget-content ui-corner-all\"/>", false, null);

		typeRepository.save(Arrays.asList(string, bigString, image, audio, date, publishedDate, video));
	}
}
