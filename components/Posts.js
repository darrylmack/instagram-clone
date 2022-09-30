import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Post from './Post'

const Posts = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const unsubsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setPosts(snapshot.docs)
      }
    )
    return unsubsubscribe
  }, [])

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} id={post.id} post={post.data()} />
      ))}
    </div>
  )
}

export default Posts
