import React from 'react'
import { useSession } from 'next-auth/react'
import MiniProfile from './MiniProfile'
import Post from './Post'
import Posts from './Posts'
import Stories from './Stories'
import Suggested from './Suggested'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const Feed = () => {
  const [currentUser] = useRecoilState(userState)
  return (
    <main
      className={`grid ${
        currentUser
          ? 'grid-cols-1 md:grid-cols-3 md:max-w-7xl mx-auto'
          : 'grid-cols-1 md:grid-cols-2 md:max-w-3xl mx-auto'
      } `}
    >
      <section className=" md:col-span-2">
        {/* Stories */}
        <Stories />
        {/* Posts */}
        <Posts />
      </section>

      <section className="hidden md:inline-grid md:col-span-1">
        <div className="fixed w-[380px]">
          {/* Mini Profile */}
          <MiniProfile />
          {/* Suggested */}
          <Suggested />
        </div>
      </section>
    </main>
  )
}

export default Feed
