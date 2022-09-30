import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const MiniProfile = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const auth = getAuth()
  const onSignOut = () => {
    signOut(auth)
    setCurrentUser(null)
  }
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        src={currentUser?.userImg}
        referrerPolicy="no-referrer"
        alt="user-image"
        className="h-16 rounded-full border p-[2px] "
      />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">{currentUser?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Not Instagram</h3>
      </div>
      <button
        className="font-semibold text-blue-400 text-sm"
        onClick={onSignOut}
      >
        Sign Out
      </button>
    </div>
  )
}

export default MiniProfile
