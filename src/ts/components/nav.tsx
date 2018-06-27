import React from "react"
import fb from 'firebase'

interface P {
  auth: fb.auth.Auth
}

export default ({auth}: P) => {
  const logout = (_e: React.MouseEvent<HTMLAnchorElement>) => {
    auth.signOut()
    .catch(err => {
      console.error(err)
      // .....
      alert("Listen to me closely. There was an error. Open console by pressing |F12|, copy the red text and send it to: devs@todo.com")
    })
  }

	return (
		<nav className="nav">
			<h1 className="nav__logo">Todo</h1>
			<ul className="nav__links">
				<li className="nav__links__item">
					<a onClick={logout} href="#" className="nav__links__item__link">
            logout
          </a>
				</li>
			</ul>
		</nav>
	)
}
