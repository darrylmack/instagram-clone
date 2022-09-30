import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { db } from '../../firebase'
import { useRouter } from 'next/router'
import Header from '../../components/Header'

const Signin = () => {
  const router = useRouter()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      const user = auth.currentUser.providerData[0]
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
          username: user.displayName.split(' ').join().toLocaleLowerCase()
        })
      }
      router.push('/')
    } catch (error) {
      console.log('Error: ', error.message)
    }
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center space-x-7 mt-20">
        <div className="">
          <div className="flex flex-col items-center">
            <img
              src="/images/not_instagram_large.png"
              alt=""
              className=" w-72 object-cover"
            />
            <p className="text-sm italic my-10 text-center">
              This app is created for demonstration purposes only.
            </p>
            <button
              className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
              onClick={onGoogleClick}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
