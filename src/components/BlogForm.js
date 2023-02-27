import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogForm = (event) => {
    event.preventDefault()
    createBlog({ author: author, title: title, url: url })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={handleBlogForm} className="blogForm">
      <div>
        Author
        <input
          id="author"
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="Author"
        />
      </div>
      <div>
        Title
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Title"
        />
      </div>
      <div>
        Url
        <input
          id="url"
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder="URL"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BlogForm
