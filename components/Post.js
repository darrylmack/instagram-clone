import React, { useEffect, useState } from 'react'

import Moment from 'react-moment'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'

import {
  DotsHorizontalIcon,
  HeartIcon,
  ChatIcon,
  BookmarkIcon,
  EmojiHappyIcon
} from '@heroicons/react/outline'

import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { db } from '../firebase'
import { async } from '@firebase/util'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const Post = ({ post, id }) => {
  const { username, profileImg, image, caption } = post

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLike, setHasLike] = useState(false)
  const [currentUser] = useRecoilState(userState)

  const sendComment = async (e) => {
    e.preventDefault()
    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: currentUser?.username,
      userImage: currentUser?.userImg,
      timestamp: serverTimestamp()
    })
  }

  const likePost = async () => {
    await setDoc(doc(db, 'posts', id, 'likes', currentUser.user.uid), {
      username: currentUser.username
    })
  }

  useEffect(() => {
    let commentArray = []
    const unsubsubscribe = onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        setComments(snapshot.docs)
      }
    )

    setComments(commentArray)
    return unsubsubscribe
  }, [db, id])

  useEffect(() => {
    setHasLike(likes.findIndex((like) => like.id === currentUser.uid)) !== -1
  }, [likes])

  return (
    <div className="bg-white my-7 rounded-md">
      {/* Post Header */}
      <div className="flex items-center p-5">
        {profileImg && (
          <img
            src={profileImg}
            referrerPolicy="no-referrer"
            alt={username}
            className="h-12 rounded-full object-cover border p-1 mr-3"
          />
        )}

        <p className="font-bold flex-1">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/*  Post Image */}
      <img src={image} alt="caption" className="object-cover w-full" />

      {/* Post Buttons */}
      {currentUser && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLike ? (
              <HeartIconFilled
                onClick={likePost}
                className="text-red-400 btn"
              />
            ) : (
              <HeartIcon className="btn" onClick={likePost} />
            )}

            <ChatIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* Post Comments */}
      <p className="p-5 truncate">
        <span className="font-bold mr-5">{username}</span>
        {caption}
      </p>
      {comments.length > 0 && (
        <div className="mx-10 max-h-24 overflow-y-scroll scrollbar-none">
          {comments.map((comment) => {
            return (
              <div
                key={comment.data().comment}
                className="flex items-center space-x-2 mb-2"
              >
                {comment.data()?.userImage && (
                  <img
                    src={comment.data().userImage}
                    referrerPolicy="no-referrer"
                    className="h-7 rounded-full object-cover"
                  />
                )}
                <p className="font-semibold">{comment.data().username}</p>
                <p className="flex-1 truncate">{comment.data().comment}</p>
                <Moment fromNow>{comment.data().timestamp?.toDate()}</Moment>
              </div>
            )
          })}
        </div>
      )}

      {/* Post Input */}
      {currentUser && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            type="text"
            placeholder="Enter your comment"
            className="border-none flex-1 focus:ring-0"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment.trim()}
            className="text-blue-400 font-bold disabled:text-blue-200"
            onClick={sendComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
