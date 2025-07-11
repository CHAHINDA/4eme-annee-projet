import { useState } from 'react'
import logo from '../assets/marsa-port.jpg'

export default function Login() {
  const [fullname, setFullname] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Connexion avec\nNom complet: ${fullname}\nMot de passe: ${password}`)
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', sans-serif;
          overflow: hidden;
        }

        body {
          background: linear-gradient(-45deg, #0074d9, #004a99, #1e3c72, #2a5298);
          background-size: 400% 400%;
          animation: gradient 10s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .login-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70vh;
        }

        .logo-outer {
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          width: 160px;
          height: 160px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(0, 116, 217, 0.4);
          margin-bottom: 25px;
          transition: transform 0.4s ease;
        }

        .logo-outer:hover {
          transform: scale(1.05);
        }

        .logo-outer img {
          width: 150px;
          height: 150px;
          object-fit: contain;
          border-radius: 50%;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(14px);
          border-radius: 20px;
          padding: 40px 30px;
          width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          color: #fff;
        }

        .login-box h2 {
          margin-bottom: 30px;
          font-weight: 700;
          font-size: 1.8rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
        }

        input {
          width: 100%;
          padding: 14px 14px 14px 42px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          color: #0b2545;
        }

        input::placeholder {
          color: #999;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          fill: #004a99;
        }

        .eye-icon {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          fill: #004a99;
          cursor: pointer;
        }

        .eye-icon:hover {
          fill: #00b4d8;
        }

        button {
          position: relative;
          padding: 14px 24px;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.1rem;
          color: white;
          cursor: pointer;
          background: linear-gradient(135deg, #00b4d8, #0077b6, #023e8a);
          background-size: 300% 300%;
          animation: pulse-bg 6s ease infinite;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 116, 217, 0.6);
          overflow: hidden;
          z-index: 1;
        }

        button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 116, 217, 0.9);
        }

        @keyframes pulse-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
            @media (max-width: 480px) {
    .login-wrapper {
      height: 100vh;
      padding: 20px;
    }
    .logo-outer {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
    }
    .logo-outer img {
      width: 110px;
      height: 110px;
    }
    .login-box {
      padding: 30px 20px;
      max-width: 100%;
      width: 100%;
    }
    .login-box h2 {
      font-size: 1.5rem;
      margin-bottom: 25px;
    }
    input {
      font-size: 0.9rem;
      padding: 12px 12px 12px 40px;
    }
    button {
      font-size: 1rem;
      padding: 12px 20px;
    }
  }
      `}</style>

      <div className="login-wrapper">
        <div className="logo-outer">
          <img src={logo} alt="Marsa Maroc" />
        </div>

        <div className="login-box">
          <h2>Connexion Marsa Maroc</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nom complet"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM9 7a3 3 0 0 1 6 0v3H9V7z" />
              </svg>
              <svg
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
                viewBox="0 0 24 24"
              >
                {showPassword ? (
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                ) : (
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                )}
              </svg>
            </div>

            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    </>
  )
}
