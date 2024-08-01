import { Content, Layout } from '@indivice/omega/components'

export default function App() {

	return Layout.Column({
		style: {
			boxSizing: 'border-box',
			height: '100vh',
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#252525",
			color: "white",
			fontSize: "64px",
			fontWeight: 'bold',
			gap: "45px"
		},

		children: [

			Content.InlineText({
				children: [
					'Welcome to ',
					Content.InlineText({
						style: {
							backgroundImage: 'linear-gradient(to right, #2B59FF, #C428FF)',
							backgroundClip: "text",
							color: 'transparent'
						},
						child: "Omega!"
					})
				]
			}),

			Layout.View({
				style: {
					backgroundImage: 'linear-gradient(to right, #2B59FF, #C428FF)',
					borderRadius: '25px',
					padding: '5px'
				},
				child: Content.Text({
					class: "code",
					style: {
						fontSize: "16px",
						fontWeight: 'normal',
						backgroundColor: "#454545",
						padding: "20px 30px",
						borderRadius: "20px"
					},
					children: [
						"Edit the contents of ",
						Content.InlineText({
							class: "code",
							style: {
								textDecoration: "underline",
							},
							child: 'app.ts'
						}),
						' to modify your app'
					]
				})
			})

		]
	})

}