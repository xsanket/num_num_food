import React from 'react'
import spinner from '../loader/spinner.svg'

export default function Spinner() {
    return (
        <div className=' bg-black flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 bg-opacity-50 z-50' >
            <div >
                <img src={spinner} alt='loading..' className="h-24 z-60" />

            </div>
        </div>
    )
}
