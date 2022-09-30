import minifaker from 'minifaker'
import 'minifaker/locales/en'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

import Story from './Story'

const Stories = () => {
  const [storyUsers, setStoryUsers] = useState([])
  const [currentUser] = useRecoilState(userState)
  useEffect(() => {
    const storyUsers = minifaker.array(20, (i) => ({
      username: minifaker.username({ locale: 'en' }).toLowerCase(),
      img: `https://i.pravatar.cc/150?img=${Math.ceil(Math.random() * 70)}`,
      id: i
    }))

    setStoryUsers(storyUsers)
  }, [])

  const renderStories = () => {
    const storyList = storyUsers.map((story) => {
      return <Story story={story} key={story.id} />
    })

    return storyList
  }

  return (
    <>
      {currentUser && (
        <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border overflow-x-scroll rounded-sm scrollbar-none">
          {renderStories()}
        </div>
      )}
    </>
  )
}

export default Stories
