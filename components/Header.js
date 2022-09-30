import { useEffect } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { modalState } from '../atom/modalAtom'
import { userState } from '../atom/userAtom'
import { SearchIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { db } from '../firebase'

const Header = () => {
  const [open, setOpen] = useRecoilState(modalState)
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const router = useRouter()
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(
            db,
            'users',
            user.auth.currentUser.providerData[0].uid
          )
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            setCurrentUser(docSnap.data())
          }
        }
        fetchUser()
      }
    })
  }, [])

  const onSignOut = () => {
    signOut(auth)
    setCurrentUser(null)
  }

  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30">
      <div className="flex items-center justify-between max-w-7xl mx-4 xl:mx-auto">
        <div className="h-32 w-32 relative hidden cursor-pointer lg:inline-grid">
          <Image
            src="/images/not_instagram_logo.png"
            layout="fill"
            className="object-contain "
            onClick={() => router.push('/')}
          />
        </div>
        <div className="h-24 w-10 relative lg:hidden cursor-pointer">
          <Image
            src="/images/Instagram_logo_2022.png"
            layout="fill"
            className="object-contain "
          />
        </div>

        {/* Middle */}

        <div className="flex space-x-4 items-center">
          <HomeIcon
            onClick={() => router.push('/')}
            className="hidden md:inline-flex h-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out"
          />
          {currentUser ? (
            <>
              <PlusCircleIcon
                className="h-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out"
                onClick={() => setOpen(true)}
              />

              <img
                src={currentUser?.userImg}
                referrerPolicy="no-referrer"
                alt="user-image"
                className="h-10 rounded-full cursor-pointer"
                onClick={() => onSignOut()}
              />
            </>
          ) : (
            <button onClick={() => router.push('auth/signin')}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
