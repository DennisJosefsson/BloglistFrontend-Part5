import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const handleClick = () => setVisible(!visible)

  const addLike = () => {
    const likes = blog.likes + 1
    updateBlog({ ...blog, likes })
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }
  return (
    <div className="blog">
      {!visible && (
        <div style={blogStyle} className="hidden">
          <p>
            {blog.title} {blog.author}
            <button onClick={handleClick}>Show</button>
          </p>
        </div>
      )}
      {visible && (
        <div style={blogStyle} className="showing">
          <p>
            {blog.title} {blog.author}{' '}
            <button onClick={handleClick}>Hide</button>
          </p>
          <p>
            <a href={`${blog.url}`}>{blog.url}</a>
          </p>
          <p>
            Likes {blog.likes} <button onClick={addLike}>Like</button>
          </p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>Remove</button>
          )}
        </div>
      )}
    </div>
  )

  // if (!visible) {
  //   return (
  //     <div style={blogStyle} className="hidden" id="blog">
  //       <p>
  //         {blog.title} {blog.author}
  //         <button onClick={handleClick}>Show</button>
  //       </p>
  //     </div>
  //   )
  // } else {
  //   return (
  // <div style={blogStyle} className="showing" id="blog">
  //   <p>
  //     {blog.title} {blog.author} <button onClick={handleClick}>Hide</button>
  //   </p>
  //   <p>
  //     <a href={`${blog.url}`}>{blog.url}</a>
  //   </p>
  //   <p>
  //     Likes {blog.likes} <button onClick={addLike}>Like</button>
  //   </p>
  //   <p>{blog.user.name}</p>
  //   {user.username === blog.user.username && (
  //     <button onClick={handleDelete}>Remove</button>
  //   )}
  // </div>
  //   )
  // }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
