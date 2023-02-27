describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const userOne = {
      username: 'DennisJ',
      name: 'Dennis Josefsson',
      password: 'dennisdennis',
    }
    const userTwo = {
      username: 'DummyUser',
      name: 'DummyUser',
      password: 'dummydummy',
    }
    cy.createUser(userOne)
    cy.createUser(userTwo)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.visit('')
    cy.contains('Log in to application')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('DennisJ')
      cy.get('#password').type('dennisdennis')
      cy.get('#loginButton').click()
      cy.contains('Dennis Josefsson is logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('DennisJ')
      cy.get('#password').type('wrongpassword')
      cy.get('#loginButton').click()
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Dennis Josefsson is logged in')
    })
    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'DennisJ', password: 'dennisdennis' })
      })
      it('A blog can be created', function () {
        cy.contains('Create new blog').click()
        cy.get('#author').type('Dennis Tester')
        cy.get('#title').type('Test title')
        cy.get('#url').type('http://testurl.test')
        cy.contains('Submit').click()
        cy.get('html')
          .should('contain', 'Dennis Tester')
          .and('contain', 'Test title')
      })
      it('Like blog post', function () {
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'A title',
          url: 'http://testurl.test',
        })
        cy.contains('A title').contains('Show').click()

        cy.contains('Like').click()
        cy.contains('Likes 1')
      })
      it('Delete blog post', function () {
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'A title',
          url: 'http://testurl.test',
        })
        cy.contains('A title').contains('Show').click()

        cy.contains('Remove').click()
        cy.get('html').should('not.contain', 'Dennis Tester')
      })
      it('Only "owner" can see remove button', function () {
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'A title',
          url: 'http://testurl.test',
        })
        cy.contains('A title').contains('Show').click()

        cy.contains('Remove')
        cy.contains('Logout').click()
        cy.login({ username: 'DummyUser', password: 'dummydummy' })
        cy.contains('Show').click()
        cy.get('html').should('not.contain', 'Remove')
      })
      it('Order of blog posts after likes', function () {
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'Title with least likes',
          url: 'http://testurl.test',
        })
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'Title second most likes',
          url: 'http://testurl.test',
        })
        cy.createBlog({
          author: 'Dennis Tester',
          title: 'Title most likes',
          url: 'http://testurl.test',
        })
        cy.contains('Title most likes').contains('Show').click()
        cy.contains('Like').click()
        cy.contains('Likes 1')
        cy.contains('Like').click()
        cy.contains('Likes 2')
        cy.contains('Like').click()
        cy.contains('Likes 3')
        cy.contains('Hide').click()
        cy.contains('Title second most likes').contains('Show').click()
        cy.contains('Like').click()
        cy.contains('Likes 1')
        cy.contains('Like').click()
        cy.contains('Likes 2')
        cy.contains('Hide').click()
        cy.contains('Title with least likes').contains('Show').click()
        cy.contains('Like').click()
        cy.contains('Likes 1')

        cy.get('.blog').eq(0).should('contain', 'Title most likes')
        cy.get('.blog').eq(1).should('contain', 'Title second most likes')
        cy.get('.blog').eq(2).should('contain', 'Title with least likes')
      })
    })
  })
})
