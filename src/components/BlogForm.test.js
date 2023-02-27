import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Testing submitting new blog via form', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={addBlog} />)

  const authorInput = screen.getByPlaceholderText('Author')
  const titleInput = screen.getByPlaceholderText('Title')
  const urlInput = screen.getByPlaceholderText('URL')
  const submitButton = screen.getByText('Submit')

  await user.type(authorInput, 'Dennis Josefsson')
  await user.type(titleInput, 'Title test')
  await user.type(urlInput, 'http://testurl.test')
  await user.click(submitButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].author).toBe('Dennis Josefsson')
  expect(addBlog.mock.calls[0][0].title).toBe('Title test')
  expect(addBlog.mock.calls[0][0].url).toBe('http://testurl.test')
})
