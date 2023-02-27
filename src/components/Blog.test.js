import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const user = { username: 'Dennis', name: 'Dennis' }
const blog = {
  author: 'Dennis Josefsson',
  title: 'Test title',
  url: 'http://testurl.test',
  likes: 5,
  user: user,
}

const updateBlog = jest.fn()
const deleteBlog = jest.fn()

test('Renders Blog component as hidden', () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
    />
  )
  const div = container.querySelector('.hidden')
  expect(div).toHaveTextContent('Test title')
  expect(div).toHaveTextContent('Dennis Josefsson')
  expect(div).not.toHaveTextContent('http://testurl.test')
  expect(div).not.toHaveTextContent('Likes 5')
})

test('Render Blog component as showing', async () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
    />
  )
  const userClick = userEvent.setup()
  const button = screen.getByText('Show')
  await userClick.click(button)

  const div = container.querySelector('.showing')
  expect(div).toHaveTextContent('http://testurl.test')
  expect(div).toHaveTextContent('Likes 5')
})

test('Clicking like button 2 times', async () => {
  render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
    />
  )
  const userClick = userEvent.setup()
  const showButton = screen.getByText('Show')
  await userClick.click(showButton)

  const likeButton = screen.getByText('Like')
  await userClick.click(likeButton)
  await userClick.click(likeButton)
  expect(updateBlog.mock.calls).toHaveLength(2)
})
