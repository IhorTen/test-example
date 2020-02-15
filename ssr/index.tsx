// import "../src/declarations/react-tree-walker"
import "../src/typings/Console"

import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import * as express from "express"
import * as path from "path"
import { StaticRouter } from "react-router-dom"
import walker from "react-tree-walker"
import { useStaticRendering } from "mobx-react"

import Helmet from "react-helmet"
import Provider from "../src/Provider"
import { StaticRouterContext } from "react-router"

import version from "../version"

var _template: string = require(`../dist/${version.v()}/index.html`)

interface IRenderResponse {
	statusCode: number,
	template: string,
	redirect?: string
}

const run = (url: string, locale?: string): Promise<IRenderResponse> => {
	console.say(`[${new Date().toISOString()} - SSR]: *run()* for *${url}*`)
	var template: string = ""
	var html: string = ""
	var head: object
	var context: StaticRouterContext = {}
	
	useStaticRendering(true)
	
	var routing = (
		<StaticRouter 
			location={url} 
			context={context}
		>
			<Provider />
		</StaticRouter>
	)

	return new Promise((resolve) => {
		walker(routing, (element, instance) => {
			if (instance && typeof instance._prepare == typeof (() => {}))
				return instance._prepare()
		}).then(() => {
			html = ReactDOMServer.renderToString(routing)
			head = Helmet.renderStatic()
			template = _template.replace(/\${__rh-([a-z]+)}/gi, (match, group) => {
				return head[group].toString()
			})
			template = template.replace(/\${__body}/gi, (match) => {
				return html
			})
			if (context.url)
				context["statusCode"] = 301
			
			resolve({
				statusCode: context["statusCode"] || 200, 
				template, 
				redirect: context.url
			})
		}).catch((error) => {
			template = _template.replace(/\${__rh-([a-z]+)}/gi, "")
			template = template.replace(/\${__body}/gi, error.stack || error.toString())
			resolve({
				statusCode: 500, 
				template
			})
		})
	})
}

var app = express()

// crutch for local server
app.use("/assets", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, `../../dist/${req.url}`))
})
app.use("/static", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, `../../static/${req.url}`))
})

app.get("*", (req, res) => {
	var accepted = req.acceptsLanguages()
	var locale = accepted ? (accepted[0] || "ru").split("-")[0] : "ru"
	run(req.originalUrl, locale).then((data) => {
		if (data.redirect)
			res.redirect(data.redirect)
		else
			res.status(data.statusCode).send(data.template)
	})
})

const PORT = process.env.PORT || 1239

app.listen(PORT)
console.ok(`[${new Date().toISOString()} - SSR]: Server is running on port *${PORT}*`)