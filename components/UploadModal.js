import { useRecoilState } from 'recoil'
import Modal from 'react-modal'
import { CameraIcon } from '@heroicons/react/outline'
import { modalState } from '../atom/modalAtom'
import { useRef, useState } from 'react'
import { db, storage } from '../firebase'
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'

import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { userState } from '../atom/userAtom'

const UploadModal = () => {
  const [open, setOpen] = useRecoilState(modalState)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentUser] = useRecoilState(userState)
  const filePickerRef = useRef(null)
  const captionRef = useRef(null)

  const addImageToPost = (event) => {
    const reader = new FileReader()
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  const uploadPost = async () => {
    if (loading) return
    console.log(currentUser)
    setLoading(true)

    const docRef = await addDoc(collection(db, 'posts'), {
      caption: captionRef.current.value,
      username: currentUser?.username,
      profileImg: currentUser?.userImg,
      timestamp: serverTimestamp()
    })

    const imageRef = ref(storage, `posts/${docRef.id}/image`)
    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL
        })
      }
    )

    setOpen(false)
    setLoading(false)
    setSelectedFile(null)
  }

  console.log(currentUser)

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => {
            setOpen(false)
            setSelectedFile(null)
          }}
          className="max-w-xl w-[90%] px-6 py-10 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
        >
          <div className="flex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                src={selectedFile}
                className="w-full max-h-[250px] object-cover cursor-pointer"
                onClick={() => setSelectedFile(null)}
              />
            ) : (
              <CameraIcon
                className="h-16 bg-blue-200 rounded-full cursor-pointer text-blue-600 p-2"
                onClick={() => filePickerRef.current.click()}
              />
            )}

            <input
              type="file"
              hidden
              ref={filePickerRef}
              onChange={addImageToPost}
            />
            <input
              type="text"
              maxLength="150"
              placeholder="Please enter your caption"
              className="m4 border-none text-center w-full focus:ring-0"
              ref={captionRef}
            />
            <button
              disabled={!selectedFile || loading}
              onClick={uploadPost}
              className="w-full bg-blue-600 text-white p-4 shadow-md hover:bg-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed "
            >
              {loading ? 'Uploading Photo...' : 'Upload Post'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UploadModal
