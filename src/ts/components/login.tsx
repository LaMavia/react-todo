import React from "react"
import fb from "firebase"

interface P {
	auth: fb.auth.Auth
}

export default ({ auth }: P) => {
	// Simple regexp for checking email
	const validateEmail = (email: string): boolean =>
		/.*@.*\.\w{2,4}/g.test(email)

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let reason = ""
		// @ts-ignore
		const { email, password } = e.target
		if (validateEmail(email.value) && password.value) {
			auth
				.signInWithEmailAndPassword(email.value, password.value)
				.then(_user => {
					debugger
				})
				.catch(res => (reason = res))
		} else {
			alert(`Something's wrong: ${reason}`)
		}
	}

	return (
		<form action="" className="form" onSubmit={submitHandler}>
			<div className="form__field">
				<label className="label" htmlFor="email">
					Login
				</label>
				<input
					type="email"
					name="email"
					id="email"
					className="form__field__input--text"
					placeholder="Login"
				/>
			</div>

			<div className="form__field">
				<label className="form__field__label" htmlFor="password">
					Password
				</label>
				<input
					type="password"
					name="password"
					id="password"
					className="form__field__input--text"
					placeholder="Password"
				/>
			</div>

			<input type="submit" value="Login" className="form__btn" />
		</form>
	)
}
