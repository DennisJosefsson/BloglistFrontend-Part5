import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className={message.status}>{message.string}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const toggleRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
      setMessage({ string: 'Wrong username or password', status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  const handleLogOut = () => {
    setMessage({ string: `${user.name} logged out`, status: 'success' })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    window.localStorage.removeItem('blogUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogData) => {
    try {
      const fullBlogData = { ...blogData, user }
      const blog = await blogService.create(fullBlogData)
      blog['user'] = user
      setBlogs(blogs.concat(blog))
      toggleRef.current.toggleVisibility()
      setMessage({
        string: `Added ${blog.title} by ${blog.author} to the list`,
        status: 'success',
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage({ string: `${error.message}`, status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogData) => {
    try {
      await blogService.update(blogData)
      const updatedBlogList = blogs.map((current) =>
        current.id === blogData.id
          ? { ...current, likes: current.likes + 1 }
          : current
      )
      setBlogs(updatedBlogList)
    } catch (error) {
      setMessage({ string: `${error.message}`, status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogData) => {
    try {
      if (window.confirm(`remove blog ${blogData.title}`)) {
        await blogService.remove(blogData)
        const updatedBlogList = blogs.filter((item) => item.id !== blogData.id)
        setBlogs(updatedBlogList)
      }
    } catch (error) {
      setMessage({ string: `${error.message}`, status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="loginButton">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} is logged in</p>
      <button onClick={handleLogOut}>Logout</button>

      <Togglable buttonLabel="Create new blog" ref={toggleRef}>
        Create new
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
