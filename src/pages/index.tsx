import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDark } from '../hooks'

function Index() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const { isDark, toggleDark } = useDark()
  const go = () => {
    if(value)
      navigate(`/hello/${encodeURIComponent(value)}`)
  }
  return (
    <div className='text-center'>
      <p className='text-gray-400 dark:text-gray-200/50'>输入你的花名:</p>
      <input 
        type='text' 
        className='p-2 outline-none active:outline-none border border-gray-200 dark:border-gray-700' 
        value={value} 
        onChange={(e) => setValue(e.target.value)}/>


      <div className='mt-3'>
        <button className='btn' onClick={go}>go</button>
      </div>
      <div className='text-center py-6 flex justify-center'>
        <div onClick={toggleDark}>
          {
            isDark 
            ?  <span className='i-carbon-moon text-gray-200' ></span>
            :  <span className='i-carbon-sun' ></span>
          }
        </div>
        <a href='https://github.com/tisou1/react-lite' target='_blank'>
          <span className='i-carbon-logo-github ml-3'></span>
        </a>
      </div>
    </div>
  )
}

export default Index