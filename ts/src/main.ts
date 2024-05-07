import './style.css'
import { RenderWeb } from '@indivice/omega/web'
import { Content, Layout } from '@indivice/omega/components'

function App() {

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

			Content.InlineTextBox({
				children: [
					Content.Text('Welcome to '),
					Content.InlineTextBox({
						style: {
							backgroundImage: 'linear-gradient(to right, #2B59FF, #C428FF)',
							backgroundClip: "text",
							color: 'transparent'
						},
						child: Content.Text("Omega!")
					})
				]
			}),

			Layout.View({
				style: {
					backgroundImage: 'linear-gradient(to right, #2B59FF, #C428FF)',
					borderRadius: '25px',
					padding: '5px'
				},
				child: Content.TextBox({
					class: "code",
					style: {
						fontSize: "16px",
						fontWeight: 'normal',
						backgroundColor: "#454545",
						padding: "20px 30px",
						borderRadius: "20px"
					},
					children: [
						Content.Text("Edit the contents of "),
						Content.InlineTextBox({
							class: "code",
							style: {
								textDecoration: "underline",
							},
							child: Content.Text('app.ts')
						}),
						Content.Text(' 	to modify your app')
					]
				})
			})

		]
	})

}

RenderWeb({
	selector: "#app",
	app: App
})