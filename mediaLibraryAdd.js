/**
 * Open a media browser modal and uploads a new file and selects it.
 *
 * Files should be in the 'fixtures' folder.
 *
 * Type is optional; can be: "audio", "video", "remote-video", "file", "image"
 * This is for media browsers that allow for different options.
 *
 * Examples:
 * cy.mediaLibraryAdd('#field_media_assets-media-library-wrapper', 'sample.png');
 * cy.mediaLibraryAdd('#field_media_assets-media-library-wrapper', 'sample.mp3', 'audio');
 */
Cypress.Commands.add("mediaLibraryAdd", (selector, fileName, type="") => {
  cy.get(selector).within(() => {
    const mediaNodeEditAjax = 'mediaNodeEditAjax' + selector + Math.random();
    cy.intercept('POST', '/node/*/**').as(mediaNodeEditAjax)
    cy.get('input[value="Add media"]').click();
    cy.wait('@'+mediaNodeEditAjax).its('response.statusCode').should('eq', 200)
  });

  const mediaNodeEditAjax2 = 'mediaNodeEditAjax' + selector + Math.random();
  cy.intercept('POST', '/node/*/**').as(mediaNodeEditAjax2)

  // Get the media modal and add files.
  cy.get('.media-library-widget-modal').within(($modal) => {
    // Check if we need to select media type
    if ($modal.find('.media-library-menu').length) {
      if (type.length > 0) {
        const buttonClass= ".media-library-menu-" + type
        const mediaLibraryAjax = 'mediaLibraryAjax' + selector + Math.random();
        cy.intercept('POST', '/media-library**').as(mediaLibraryAjax)
        cy.get(buttonClass).click();
        cy.wait('@' + mediaLibraryAjax).its('response.statusCode').should('eq', 200)
      }
    }

    // Upload the file.
    const mediaLibraryAjax1 = 'mediaLibraryAjax' + selector + Math.random();
    cy.intercept('POST', '/media-library?*').as(mediaLibraryAjax1)
    cy.get('input[type=file]').selectFile('cypress/fixtures/' + fileName);
    cy.wait('@' + mediaLibraryAjax1).its('response.statusCode').should('eq', 200)


    // Basic check if the file is an image so we know if we have to add some alt tags.
    if (fileName.includes(".png") || fileName.includes(".jpg")) {
      cy.get('.media-library-add-form').contains('Alternative text').next().type('alt text');
    }

    // Select the uploaded file.
    const mediaLibraryAjax2 = 'mediaLibraryAjax' + selector + Math.random();
    cy.intercept('POST', '/media-library?*').as(mediaLibraryAjax2)
    cy.get('.form-actions button').contains('save', { matchCase: false }).click()
    cy.wait('@' + mediaLibraryAjax2).its('response.statusCode').should('eq', 200)

    // Insert from media library
    const mediaLibraryAjax3 = 'mediaLibraryAjax' + selector + Math.random();
    cy.intercept('POST', '/media-library**').as(mediaLibraryAjax3)
    cy.get('.form-actions button').contains('insert', { matchCase: false }).click()
    cy.wait('@' + mediaLibraryAjax3).its('response.statusCode').should('eq', 200)
  })

  cy.wait('@'+mediaNodeEditAjax2).its('response.statusCode').should('eq', 200)
});
