![shrubs](https://github.com/kanopi/shrubs/assets/5177009/e0d0ed6e-7e08-43be-9c82-69119bb19ab5)

# Shrubs Cypress Commands Cheatsheet

## Administration

- [Log into Drupal](login.js): `cy.login('User', 'pass')`
- [Logout of Drupal](logout.js): `cy.logout()`
- [Use Drush](drush.js): `cy.drush('cr')`
- Go to a page: `cy.visit('/path')`

## Systems Testing

- Check Sendgrid works: [Code Snippet](#check-sendgrid-works)

## Content Type Testing

- Check if you are on the front or home page: [Code Snippet](#check-if-you-are-on-the-front-or-home-page)

### Creating a Node

- Go to a node add form: `cy.visit('/node/add'); // Replace with the actual URL of your content`
- Fill out a text field: `cy.get('#id-selector').type(enter-string);`
- Choose a select list option: `cy.get('#id-selector').select('option');`
- Choose a radio or checkbox: `cy.get('#id-selector').click();`
- [Choose an autocomplete](autocomplete.js): `cy.autocomplete('[data-drupal-selector="edit-field-sample-0-target-id"]', 'item');`
- [Fill out a rich text editor field](ckeditorType.js): `cy.ckeditorType('#edit-body-0-value', 'string of text')`
- [Validate content in a rich text editor field](ckeditorGet.js): `const example_content = 'some text'; cy.ckeditorGet('#edit-body-wrapper').should('contain', example_content)`
- Create a Paragraph: [Code Snippet](#create-a-paragraph)
- Create multiple Paragraphs with additional fields: [Code Snippet](#create-multiple-paragraphs-with-additional-fields)
- Preview a node: [Code Snippet](#preview-a-node)
- Save a node: [Code Snippet](#save-a-node)
- Change a node's path: [Code Snippet](#change-a-nodes-path)
- Add a node to a menu: [Code Snippet](#add-a-node-to-a-menu)
- Include/Exclude a node from an XML Sitemap: [Code Snippet](#includeexclude-a-node-from-an-xml-sitemap)
- [Uploading a file](uploadFile.js): `cy.uploadFile('#file-field-wrapper', 'example.png')`
- [Choosing a file from a media library](mediaLibrarySelect.js): `cy.mediaLibrarySelect('#field_media_assets-media-library-wrapper', 'sample.png', 'image')`
- [Add file from media library](mediaLibraryAdd.js): `cy.mediaLibraryAdd('#field_media_assets-media-library-wrapper', 'sample.mp3', 'audio')`
- Change Revision state: [Code Snippet](#change-revision-state)
- Add to a menu: [Code Snippet](#add-to-a-menu)
- Schedule a publishing time: [Code Snippet](#schedule-a-publishing-time)
- Schedule an unpublishing time: [Code Snippet](#schedule-an-unpublishing-time)
- Write a revision log message: [Code Snippet](#write-a-revision-log-message)
- Open a field group tab in the admin: [Code Snippet](#open-a-field-group-tab-in-the-admin)
- Tests based on Lighthouse mobile and dekstop viewport sizes: [Code Snippet](#tests-based-on-lighthouse-mobile-and-dekstop-viewport-sizes)

### Deleting a Node

- Delete a node from node page while logged in: [Code Snippet](#delete-a-piece-of-content-from-the-node-page)
- Delete a node from the node edit page while logged in: [Code Snippet](#delete-a-piece-of-content-from-the-node-edit-page)

## User Role Testing

The following commands generally best created as support commands.

- Create a Content Type: [Code Snippet](#create-a-content-type)
- Test if a user/user role can't create content: [Code Snippet](#user-content-test-if-a-useruser-role-cant-create-content)
- Test if User or User Role can or can't delete a Content type: [Code Snippet](#test-if-user-or-user-role-can-or-cant-delete-a-content-type)

Then multiple e2e tests can re-use them like this:

- Test a user/user role's ability to create multiple content types: [Code Snippet](#user-content-test-a-useruser-roles-ability-to-create-multiple-content-types)


## Code Snippets

### Create a Paragraph

```markdown
cy.visit('/node/123/edit');
cy.get('.add-paragraph-button').click();
cy.get('#edit-paragraph-field-name').type('My Paragraph Name');
// Fill in other paragraph fields here
cy.get('#edit-submit').click();
```

### Create multiple Paragraphs with additional fields
```markdown
it('Create a test paragraph.', () => {
  // Login and visit specified node.
  cy.login('cypress', 'cypress')
  cy.visit('/node/289/edit');
  cy.wait(500);
  // Switch to the content tab.
  cy.get('#node-page-edit-form').contains('Content').click();
  // Get the Entity Reference Revisions (Paragraphs) field's dropdown button and click it.
  cy.get('[data-drupal-selector="edit-field-components-add-more"] .dropbutton__toggle').click();
  // Get the name of the paragraph type you want and click that.
  cy.get('input[name="field_components_image_and_text_add_more"]').click();
  // Now we're in the subform and we can fill out the fields, Title, link uri, and link title.
  cy.get('input[name="field_components[0][subform][field_title][0][value]"]').type('Title');
  cy.get('[data-drupal-selector="edit-field-components-0-subform-field-link-0-uri"]').type('www.google.com');
  cy.get('[data-drupal-selector="edit-field-components-0-subform-field-link-0-title"]').type('Google');
  // Add another paragraph and fill out the fields.
  cy.get('[data-drupal-selector="edit-field-components-add-more"] .dropbutton__toggle').click();
  cy.get('input[name="field_components_call_to_action_add_more"]').click();
  cy.get('input[name="field_components[1][subform][field_title][0][value]"]').type('Title');
  cy.get('[data-drupal-selector="edit-field-components-1-subform-field-link-0-uri"]').type('www.google.com');
  cy.get('[data-drupal-selector="edit-field-components-1-subform-field-link-0-title"]').type('Google');
  // Save the node.
  cy.get("#edit-submit--2--gin-edit-form").click();
})
```

### Preview a Node

```markdown
cy.visit('/node/123/edit');
cy.get('.preview-button').click();
// Verify that you are in preview mode
cy.contains('Preview Mode').should('be.visible');
// Perform actions or assertions in preview mode
```

### Save a Node

```markdown
cy.visit('/node/add/page');
// Fill in node fields
cy.get('#edit-title-0-value').type('Test Node Title');
cy.get('#edit-body-0-value').type('This is the content of the test node.');
cy.get('#edit-submit').click();
// Verify that the node has been successfully saved
cy.contains('The content has been saved.').should('be.visible');
```

### Change a Node's Path

```markdown
// Visit edit page for node
cy.visit('/node/123/edit');
// Select URL Alias tab and enter in new path alias
cy.get('#edit-path-0-alias').clear().type('new-path-alias');
cy.get('#edit-submit').click();
// Verify that the node's path alias has been successfully changed
cy.url().should('include', '/new-path-alias');
```

### Add a Node to a Menu

```markdown
// Visit edit page of node
cy.visit('/node/123/edit');
// Click on Menu settings tab
cy.get('.menu-settings-details summary').click();
// Select what menu you want it to be a part of
cy.get('#edit-menu-parent').select('Main Menu');
// Fill in other menu fields
// Save changes to node menu
cy.get('#edit-submit').click();
```

### Include/Exclude a Node from an XML Sitemap

```markdown
// Need to test and validate this example code
cy.visit('/node/123/edit');
// Click on xml sitemap tab dropdown
cy.get('.sitemap-settings-details summary').click();
// Click on dropdown tabs for sitemap
cy.get('#edit-xmlsitemap-include').click();
// Select dropdown tab option
cy.get('#your-dropdown-element').select('Option Text');
// Save changes to node
cy.get('#edit-submit').click();
```

### Change Revision State

```markdown
// Changes revision state to published
cy.visit('/node/1/edit');
cy.get('#edit-revision-state').as('revisionStateField');
cy.get('@revisionStateField').select('published');
cy.get('#edit-form').submit();
cy.get('#revision-state').should('contain', 'published');
```

### Add to a Menu

```markdown
// Visit content type edit page
cy.visit('/admin/structure/types/manage/blank')
cy.get('#edit-menu-settings').as('menuSettingsFieldset');
cy.get('@menuSettingsFieldset').find('#edit-menu-enabled').as('menu');
cy.get('@menu').check();
cy.get('#edit-submit').click();
```

### Schedule a Publishing Time

```markdown
cy.visit('node/add/article');
cy.get('#edit-title-0-value').type('My Article Title');
cy.get('#edit-scheduling-options').click();
cy.get('#edit-publish-on').type('2023-12-31 00:00:00');
cy.get('#edit-submit').click();
cy.get('#scheduled-publishing-time').should('contain', '2023-12-31 00:00:00');
```

### Schedule a Unpublishing Time

```markdown
cy.visit('node/1/edit');
cy.get('#edit-scheduling-options').click();
cy.get('#edit-unpublish-on').type('2023-12-31 00:00:00');
cy.get('#edit-submit').click();
cy.get('#scheduled-unpublishing-time').should('contain', '2023-12-31 00:00:00');
```

### Write a Revision Log Message

```markdown
cy.visit('node/1/edit');
cy.get('#edit-revision-information').click();
cy.get('#edit-revision-log-0-value').type('This is a revision log message.');
cy.get('#edit-submit').click();
cy.get('#revision-log-message').should('contain', 'This is a revision log message');
```

### Open a field group tab in the admin
```markdown
cy.visit('/node/[nodeID]/edit');
// Switch to the horizontal content tab.
cy.get('#node-page-edit-form').contains('Content').click()
```

### Create a Content Type

```markdown
// Visit any content type creation page.
cy.visit('/node/add/event')
// Set title, body, and image.
const nodeTitle = "TEST CONTENT - " +  randCompanyName();
cy.get("#edit-title-wrapper").type(nodeTitle);
const nodeBody = randLines();
cy.ckeditorType('#edit-body-wrapper', nodeBody);
cy.mediaLibrarySelect('#field_image-media-library-wrapper', 'image-sample_01.png', 'image')
cy.get("#edit-submit--2--gin-edit-form").click();
// Validate.
cy.get('main').should('contain', nodeTitle);
cy.get('main').should('contain', nodeBody);
```

### Test if a user/user role can't create content

```markdown
// User should hit a 403 error on a restricted node/add.
cy.request({
  url: '/node/add/event',
  followRedirect: false,
  failOnStatusCode: false
}).then((resp) => {
    expect(resp.status).to.eq(403)
})
```

### Test a user/user role's ability to create multiple content types

```markdown
// Create support commands for each content type and run in series with user role.
cy.login('cypress', 'cypress');
cy.createDocument();
cy.createEvent();
cy.createPage();
cy.createPerson();
cy.logout();
```

### Test if User or User Role can delete a Content type
```markdown
it('Test if user role can delete content type.', () => {
    // Login with role and visit node of specific content type.
    cy.login('roleToTestName', 'roleToTestPassword')
    cy.visit(nodePathOfContentType);
    // Click node Delete button.
    cy.get('.nav-link').contains('Delete').click();
    // Click confirm delete.
    cy.get('#edit-submit').contains('Delete').click();
    // Validate, we should be on the home page after deletion.
    cy.location('pathname').should('eq', '/');
})
it('Test if user role can't delete content type.', () => {
    // Login with role and visit node of specific content type.
    cy.login('roleToTestName', 'roleToTestPassword')
    cy.visit(nodePathOfContentType);
    // Assert that the button should not exist on the page.
    cy.get('.nav-link').contains('Delete').should('not.exist');
})
```

### Delete a piece of content from the node page

```markdown
Cypress.Commands.add('deleteContentFromNode', (nodeID) => {
  let nodePath = 'node/' + nodeID;
  // Visit a node
  cy.visit(nodePath);
  // Click node Delete button.
  cy.get('.nav-link').contains('Delete').click();
  // Click confirm delete.
  cy.get('#edit-submit').contains('Delete').click();
  // Validate, we should be on the home page.
  cy.location('pathname').should('eq', '/');
})
```

### Delete a piece of content from the node edit page

```markdown
// Visit the node edit page.
cy.visit('node/[nodeID]/edit?destination=/admin/content')
// Click node Delete button.
cy.get('#edit-delete--2').click();
// Create a unique variable name for the ajax listener.  Cypress does not like it being reused.
const deleteModalAjax = 'deleteModalAjax' + '#edit-delete--2' + Math.random();
cy.intercept('POST', '/media-library**').as(deleteModalAjax)
// Get the delete modal and delete the node.
cy.get('.ui-dialog-buttonpane').within(($modal) => {
  // Get the delete button in the modal and click.
  cy.get('.button--danger').contains('Delete', { matchCase: false }).click();
})
// Validate, we should be on the admin/content page.
cy.get('h1').should('contain', 'Content');
```

### Check if you are on the front or home page

```markdown
// Visit the home page
// Update this URL based on your application's structure
cy.visit('/');
// Check if the current URL is the home page
cy.location('pathname').should('eq', '/');
```

### Tests based on Lighthouse mobile and desktop viewport sizes

```markdown
describe('Test based on Lighthouse viewport width.', () => {
  context('Desktop', () => {
    it('Desktop Test item', () => {
      // Vist the home slug and set to Lighthouse desktop viewport size.
      cy.visit('/')
      cy.viewport(940, 1350)
      // Do things.
    })
  })
  context('Mobile', () => {
    it('Mobile Test item', () => {
      // Vist the home slug and set to Lighthouse mobile viewport size.
      cy.visit('/')
      cy.viewport(360, 640)
      // Do things.
    })
  })
})
```


### Check Sendgrid works

```
describe('Check sendgrid is sending emails', () => {
    it('Login and send a test email', () => {
        cy.login()
        cy.visit('/admin/config/services/sendgrid/test')
        const mailinatorEmail = '1234567890@mailinator.com';
        cy.get('#edit-to').clear().type(mailinatorEmail);
        cy.get('#edit-submit').click()
        cy.get('.messages-list .messages--status').should('contain', 'SendGrid test email sent')    
    })
})
```
