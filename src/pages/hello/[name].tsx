import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
export default function Hello() {
  const params =  useParams()
  const navigate = useNavigate()
  return (
    <div className='text-center'>
      <p className='text-sm opacity-50'>欢迎: {params.name}</p>
      <div>
        <button className='btn m-3 text-sm mt-8"' onClick={() => navigate(-1)}>
          back
        </button>
      </div>
    </div>
  )
}