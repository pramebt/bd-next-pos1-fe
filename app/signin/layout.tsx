import '../../public/plugins/fontawesome-free/css/all.min.css';
import '../../public/dist/css/adminlte.min.css';

import React from 'react'

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <div className="hold-transition login-page">
            {children}
        </div>
    </div>
  )
}

export default SigninLayout