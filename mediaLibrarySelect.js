/**
 * Open a media browser modal and selects an existing media item
 *
 * Files should be in the 'fixtures' folder.
 *
 * Type is optional; can be: "audio", "video", "remote-video", "file", "image"
 * This is for media browsers that allow for different options.
 *
 * Examples:
 * cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png');
 * cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png', 'image');
 */
Cypress.Commands.add("mediaLibrarySelect", (selector, fileName, type="") => {
  // Create a unique variable name for the ajax listener.  Cypress does not like it being reused.
  const mediaNodeEditAjax = 'mediaNodeEditAjax' + selector + Math.random();
  cy.intercept('POST', '/node/*/**').as(mediaNodeEditAjax)

  cy.get(selector).within(() => {
    cy.get('input[value="Add media"]').click();
    cy.wait('@'+mediaNodeEditAjax).its('response.statusCode').should('eq', 200)
  });

  // Get the media modal and add files.
  cy.get('.media-library-widget-modal').within(($modal) => {
    // Check if we need to select media type
    if ($modal.find('.media-library-menu').length) {
      if (type.length > 0) {
        const buttonClass= ".media-library-menu-" + type
        mediaLibraryAjax = 'mediaLibraryAjax' + selector + Math.random();
        cy.intercept('POST', '/media-library**').as(mediaLibraryAjax)
        cy.get(buttonClass).click();
        cy.wait('@' + mediaLibraryAjax).its('response.statusCode').should('eq', 200)
      }
    }

    // Search for the file.
    cy.get('.views-exposed-form input[name="name"]').clear().type(fileName);
    let viewsAjax = 'viewsAjax' + selector + Math.random();
    cy.intercept('GET', '/views/ajax?**').as(viewsAjax)
    cy.get('.views-exposed-form input[type="submit"]').click();
    cy.wait('@' + viewsAjax).its('response.statusCode').should('eq', 200)


    // Select the first match
    cy.get('.media-library-views-form .views-row').first().click();

    // Insert from media library
    mediaLibraryAjax = 'mediaLibraryAjax' + selector + Math.random();
    cy.intercept('POST', '/media-library?**').as(mediaLibraryAjax)
    cy.get('.form-actions button').contains('Insert selected').click()
    cy.wait('@' + mediaLibraryAjax).its('response.statusCode').should('eq', 200)
  })

  cy.wait('@'+mediaNodeEditAjax).its('response.statusCode').should('eq', 200)
  cy.wait(500)
});
